'use client';

import { useParams } from 'next/navigation';

const OrganizationIdPage = () => {
  const { organizationId } = useParams();
  return <div>OrganizationIdPage {organizationId}</div>;
};

export default OrganizationIdPage;
