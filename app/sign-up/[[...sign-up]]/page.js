import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='flex items-center justify-center flex-col gap-10 text-center'>
        <h1 className='font-bold mt-10 text-4xl'>FlashCard Saas Sign Up Page</h1>
        <SignUp />
    </div>
  )
}