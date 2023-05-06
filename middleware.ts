import { withAuth } from 'next-auth/middleware';

import { NEXT_PUBLIC_NEXTAUTH_ENABLED } from './utils/app/const';

const getSecret = () => {
  if (NEXT_PUBLIC_NEXTAUTH_ENABLED === false) {
    return 'auth_not_enabled';
  } else {
    return process.env.NEXTAUTH_SECRET;
  }
};

export default withAuth({
  callbacks: {
    async authorized({ token }) {
      if (NEXT_PUBLIC_NEXTAUTH_ENABLED === false) {
        return true;
      }
      if (!token?.email) {
        return false;
      } else {
        const pattern = process.env.NEXTAUTH_EMAIL_PATTERN || '';
        if (!pattern) return true;
        const allowedEmails = pattern.split(';');
        const email = token.email;
        const isAllowed = allowedEmails.some((allowedEmail) => {
          return email.match(allowedEmail);
        });
        return isAllowed;
      }
    },
  },
  secret: getSecret(),
});

export const config = { matcher: ['/'] };
