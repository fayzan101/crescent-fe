"use client"
import OfficeManagementForm from '@/components/office-management/OfficeManagementForm';
import React  from 'react'

const Page = () => {

  return (
    <div className="">
      {/* <div className="flex flex-col gap-5"> */}

        {/* Dynamic clients Content */}
        <div className="mt-4">
          <OfficeManagementForm/>
        </div>
      {/* </div> */}
    </div>
  )
}

export default Page