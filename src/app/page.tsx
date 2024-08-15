'use client'

import Link from 'next/link'
import Image from 'next/image'
import { headers, cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils/supabase'
import Header from '@/components/Header'
import Intro from '@/components/Intro'
import Tutorial from '@/components/Tutorial'
import FAQ from '@/components/FAQ'
import ViewingPage from './ViewingPage.jpeg'
import Consent from '@/components/Consent'

export default function LandingPage() {
  return (
    <>
      <Header />
      <Consent />
      <div className="mb-0 mt-10 pb-0">
        <Intro />
        <Image src={ViewingPage} alt="Viewing Page" className="mx-auto w-1/2" />
        <Tutorial />
        <FAQ />
      </div>
    </>
  )
}
