"use client"

import AddClientForm from '@/components/clients/AddClientForm';
import Clients from '@/components/clients/Clients';
import HeaderButton from '@/components/shared/HeaderButton';
import NotificationIcon from '@/components/shared/NotificationIcon';
import { useClientContext } from '@/context/clientContext';
import { headerButtons } from '@/data/headerButtons';
import React, { useState } from 'react'

const Page = () => {
  const { showAddClient } = useClientContext();

  return (
    <div className="">
      {/* <div className="flex flex-col gap-5"> */}

        {/* Dynamic clients Content */}
        <div className="mt-4">
          {showAddClient ? <AddClientForm /> : <Clients />}
        </div>
      {/* </div> */}
    </div>
  )
}

export default Page