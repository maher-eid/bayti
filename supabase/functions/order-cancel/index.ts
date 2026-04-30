import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { cancel_token } = await req.json()
    
    if (!cancel_token || typeof cancel_token !== 'string' || cancel_token.length !== 32) {
      return new Response(
        JSON.stringify({ error: 'Invalid cancel token' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // First get the order to check status
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('id, status, cancel_token')
      .eq('cancel_token', cancel_token)
      .single()

    if (fetchError || !order) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }), 
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if cancellable
    const cancellableStatuses = ['Pending', 'Confirmed']
    if (!cancellableStatuses.includes(order.status)) {
      return new Response(
        JSON.stringify({ error: `Cannot cancel order in ${order.status} status` }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Update order
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: 'Cancelled', 
        cancelled_at: new Date().toISOString(),
        cancelled_by: 'customer'
      })
      .eq('id', order.id)

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to cancel order' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verify update by re-fetching
    const { data: updatedOrder, error: verifyError } = await supabase
      .from('orders')
      .select('id, status')
      .eq('id', order.id)
      .single()

    if (verifyError || !updatedOrder || updatedOrder.status !== 'Cancelled') {
      return new Response(
        JSON.stringify({ error: 'Failed to verify cancellation' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Return full updated order for frontend refresh
    const { data: fullOrder, error: fullError } = await supabase
      .from('orders')
      .select(`
        id,
        customer_name,
        phone,
        address,
        city,
        items,
        total,
        status,
        created_at
      `)
      .eq('id', order.id)
      .single()

    if (fullError || !fullOrder) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch updated order' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ order: fullOrder }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
