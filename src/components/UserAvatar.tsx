import { auth } from '../../auth';

export default async function UserAvatar() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <div>
      User Avatar
      {/* <img src={session.user.image} alt="User Avatar" /> */}
    </div>
  );
}
