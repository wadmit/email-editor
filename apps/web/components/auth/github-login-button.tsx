import { Button } from '../ui/button';
import { Icons } from '../icons';

export function GithubLoginButton() {
  return (
    <form action="/auth/login" className="flex grow flex-col" method="POST">
      <input name="provider" type="hidden" value="github" />
      <Button className="gap-2" size="sm" type="submit" variant="outline">
        {/* eslint-disable-next-line react/jsx-pascal-case -- This is a icon */}
        <Icons.github className="h-4 w-4" />
        Continue with GitHub
      </Button>
    </form>
  );
}
