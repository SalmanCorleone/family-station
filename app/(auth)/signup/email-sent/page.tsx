import { Suspense } from 'react';

export default function EmailSentContainer() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailSentContainer />
    </Suspense>
  );
}
