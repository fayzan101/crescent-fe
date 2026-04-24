import Sales from '@/components/sales/Sales';
import React from 'react'

const Page = () => {
  return (
    <div className="flex flex-col gap-5">
        {/* Full-width bar under buttons */}
        {/* <div className="w-full h-2 rounded-full bg-customBlue mt-2"></div> */}

        <Sales />
    </div>
  )
}

export default Page;