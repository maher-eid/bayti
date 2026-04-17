import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ProtectedAdminRoute() {
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (mounted) {
          setIsAllowed(false);
          setLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from('admins')
        .select('id, role')
        .eq('id', user.id)
        .single();

      if (mounted) {
        setIsAllowed(!error && !!data);
        setLoading(false);
      }
    };

    checkAdmin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <p style={{ padding: '2rem' }}>Checking admin access...</p>;
  }

  if (!isAllowed) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}