'use client';
import React from 'react';
import { InternalUserProfile } from './shared';

export default function Preview({ currentUser, displayUser }: any) {
  return (
        <div className="w-full py-12">
          <InternalUserProfile onLogout={() => toast.info('Log Out sequence initiated.')} />
        </div>
      );
}
