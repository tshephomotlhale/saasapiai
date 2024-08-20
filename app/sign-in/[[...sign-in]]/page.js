import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='flex items-center justify-center flex-col gap-10 text-center bg-[#C2CFB2] min-h-screen'>
        <h1 className='text-4xl font-bold mt-10 text-[#4B4A67]'>Sign In to FlashCard SaaS</h1>
        <SignIn />
    </div>
  )
}