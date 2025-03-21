import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const withAuth = (WrappedComponent: React.ComponentType) => {
    const AuthenticatedComponent: React.FC = (props) => {
        const { user, isLoading } = useUser();
        const router = useRouter();

        useEffect(() => {
            if (!isLoading && !user) {

                router.push('/api/auth/login');
            }
        }, [user, isLoading, router]);

        if (isLoading) {
            return <div>Cargando...</div>;
        }

        if (!user) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };

    return AuthenticatedComponent;
};

export default withAuth;