import { Suspense } from 'react';
import EmailSentContainer from '../_components/emailSentContainer';

export default function EmailSent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailSentContainer />
    </Suspense>
  );
}
