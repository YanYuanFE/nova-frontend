import { Link } from 'react-router-dom';
import { UserAuthForm } from './UserAuthForm';
import { Icons } from '@/components/icons';
import WordRotate from '@/components/magicui/word-rotate';
import { BackgroundBeams } from '@/components/ui/background-beams';

export const metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function SignIn() {
  return (
    <>
      <div className="container relative h-screen flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />

          <div className="relative z-20 flex items-center text-lg font-medium">
            <Icons.logo className="mr-2 h-6 w-6" />
            Nova
          </div>
          <div className="relative z-20 mt-20">
            <img
              src="https://www.cairo-lang.org/wp-content/uploads/2024/04/Cairo-logo-hero-shadow-opt.png"
              className="w-[200px]"
              alt=""
            />
            <h1 className="font-display text-3xl font-bold tracking-tight flex items-center gap-2 mt-10 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600">
              Unleashing the Power of Cairo Development.
            </h1>
            <p className="mt-6 max-w-2xl text-md tracking-tight text-gray-400">
            Nova is the all-in-one web IDE for Cairo development on StarkNet, streamlining the entire process from code creation to contract deployment and debugging—all within your browser. Experience unparalleled customization, seamless UX, and future-ready tools 
            </p>
          </div>
          <BackgroundBeams />
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
              <p className="text-sm text-muted-foreground">Connect to Github account to authorize login</p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{' '}
              <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
