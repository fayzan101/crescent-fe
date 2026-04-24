import React from 'react'
import FieldWrapper from '../ui/FieldWrapper'
import Select from '../ui/Select'
import Input from '../ui/Input'
import DateInput from '../ui/DateInput'
import Textarea from '../ui/TextArea'

const ConfidentialForm = () => {
    return (
        <div className="flex-1 flex flex-col gap-4 md:gap-6">
            {/* Heading */}
            <h2 className="text-center text-gray-100 bg-customGreen rounded-lg p-3 text-sm md:text-base font-medium">
                Briefing - Private & Confidential Information
            </h2>

            {/* Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                {/* Column 1 */}
                <div className="flex flex-col gap-3 md:gap-3">
                    <FieldWrapper label="Normal Code" required className="text-sm">
                        <Input placeholder="Type (1234)" className="text-sm py-2" />
                    </FieldWrapper>

                    <FieldWrapper label="Mother Name" className="text-sm">
                        <Input placeholder="Type here" className="text-sm py-2" />
                    </FieldWrapper>

                    <FieldWrapper label="1st Section User" className="text-sm">
                        <Input placeholder="Type here" className="text-sm py-2" />
                    </FieldWrapper>

                    <FieldWrapper label="Contact No. 1" className="text-sm">
                        <Input placeholder="Type here" className="text-sm py-2" />
                    </FieldWrapper>
                    
                    <FieldWrapper label="Emergency Contact Person" className="text-sm">
                        <Input placeholder="Type here" className="text-sm py-2" />
                    </FieldWrapper>

                    <FieldWrapper label="Driver Name" className="text-sm">
                        <Input placeholder="Type here" className="text-sm py-2" />
                    </FieldWrapper>

                    <FieldWrapper label="SMS Alert" className="text-sm">
                        <Input placeholder="Type here" className="text-sm py-2" />
                    </FieldWrapper>
                    
                    <FieldWrapper label="SMSGeo Fence City" className="text-sm">
                        <Input placeholder="Type here" className="text-sm py-2" />
                    </FieldWrapper>
                    
                    <FieldWrapper label="Sales Person" className="text-sm">
                        <Input placeholder="Type here" className="text-sm py-2" />
                    </FieldWrapper>
                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-3 md:gap-3">
                    <FieldWrapper label="Emergency Code" className="text-sm">
                        <Input placeholder="Type (1234)" className="text-sm py-2" />
                    </FieldWrapper>
                    
                    <FieldWrapper label="Blood Group" className="text-sm">
                        <Select placeholder="Select" className="text-sm py-2" />
                    </FieldWrapper>

                    <FieldWrapper label="Relation" className="text-sm">
                        <Input placeholder="Type here" className="text-sm py-2" />
                    </FieldWrapper>
                    
                    <FieldWrapper label="Contact no. 2" className="text-sm">
                        <Input placeholder="Type here" className="text-sm py-2" />
                    </FieldWrapper>
                    
                    <FieldWrapper label="Mobile App" className="text-sm">
                        <Input placeholder="Type here" className="text-sm py-2" />
                    </FieldWrapper>

                    <FieldWrapper label="Remarks" className="text-sm">
                        <Textarea 
                            placeholder="Type here" 
                            className="min-h-[60px] md:min-h-[80px] text-sm"
                        />
                    </FieldWrapper>

                    <FieldWrapper label="Technician" className="text-sm">
                        <Input placeholder="Type here" className="text-sm py-2" />
                    </FieldWrapper>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button
                    className="
                        w-full sm:w-auto
                        text-customBlue
                        border border-customBlue
                        px-4 py-2
                        rounded-lg
                        text-sm font-medium
                        transition
                        hover:bg-gray-100
                    "
                >
                    Save
                </button>

                <button
                    className="
                        w-full sm:w-auto
                        px-4 py-2 rounded-lg text-sm font-medium transition
                        bg-customBlue text-gray-100 hover:bg-customBlue/90 cursor-pointer
                    "
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default ConfidentialForm