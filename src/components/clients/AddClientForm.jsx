"use client";

import { useClientContext } from "@/context/clientContext";
import React, { useState, useEffect } from "react";
import FieldWrapper from "../ui/FieldWrapper";
import Input from "../ui/Input";
import Select from "../ui/Select";
import DateInput from "../ui/DateInput";
import Textarea from "../ui/TextArea";

const AddClientForm = () => {
    const { closeAddClientForm } = useClientContext();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <div className={`${isMobile ? 'flex flex-col' : 'flex flex-col lg:flex-row'} gap-4 lg:gap-6`}>
                <div className={`${isMobile ? 'w-full h-16' : 'w-48 h-48 lg:h-25'} text-lg md:text-xl font-semibold text-gray-100 bg-customGreen rounded-xl flex items-center justify-center ${isMobile ? 'mb-2' : ''}`}>
                    {isMobile ? 'Client Info' : 'Client Information'}
                </div>

                {/* Right Form */}
                <div className="flex-1 flex flex-col gap-4 md:gap-6">
                    {/* Heading */}
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                        Add Information
                    </h2>

                    {/* Form Grid - Responsive */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {/* Column 1 */}
                        <div className="flex flex-col gap-3 md:gap-4">
                            <FieldWrapper label="Contact No. / Client ID" required>
                                <Input placeholder="Type here" />
                            </FieldWrapper>

                            <FieldWrapper label="Select Type" required>
                                <Select placeholder="Select" />
                            </FieldWrapper>

                            <FieldWrapper label="Industry" required>
                                <Input placeholder="12345-1234567-1" />
                            </FieldWrapper>

                            <FieldWrapper label="Phone Office 1" required>
                                <Input placeholder="Type here" />
                            </FieldWrapper>

                            <FieldWrapper label="Email ID" required>
                                <Input placeholder="Type here" />
                            </FieldWrapper>

                            <FieldWrapper label="City" required>
                                <Select placeholder="Select" />
                            </FieldWrapper>
                        </div>

                        {/* Column 2 */}
                        <div className="flex flex-col gap-3 md:gap-4">
                            <FieldWrapper label="Date" required>
                                <DateInput placeholder="25/12/2025" />
                            </FieldWrapper>

                            <FieldWrapper label="Client Name" required>
                                <Input placeholder="Type here" />
                            </FieldWrapper>

                            <FieldWrapper label="Client Website">
                                <Input placeholder="Type here" />
                            </FieldWrapper>

                            <FieldWrapper label="Phone Office 2">
                                <Input placeholder="Type here" />
                            </FieldWrapper>

                            <FieldWrapper label="Address">
                                <Input placeholder="Type here" />
                            </FieldWrapper>

                            <FieldWrapper label="Province" required>
                                <Select placeholder="Select" />
                            </FieldWrapper>
                        </div>
                    </div>

                    {/* Contact Person (POC) Section */}
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800 mt-2 md:mt-0">
                        Contact Person (POC)
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {/* Column 1 */}
                        <div className="flex flex-col gap-3 md:gap-4">
                            <FieldWrapper label="Full Name" required>
                                <Input placeholder="Type here" />
                            </FieldWrapper>
                            <FieldWrapper label="POC Email">
                                <Input placeholder="Type here" />
                            </FieldWrapper>
                            <FieldWrapper label="Add Remarks">
                                <Textarea placeholder="Type here" rows={isMobile ? 3 : 4} />
                            </FieldWrapper>
                        </div>

                        {/* Column 2 */}
                        <div className="flex flex-col gap-3 md:gap-4">
                            <FieldWrapper label="POC Designation" required>
                                <DateInput placeholder="Type here" />
                            </FieldWrapper>

                            <FieldWrapper label="POC Contact No." required>
                                <Input placeholder="Type here" />
                            </FieldWrapper>

                            {/* Buttons Section */}
                            <div className="mt-2 md:mt-4">
                                <div className="flex flex-col gap-3 w-full">
                                    {/* Top button */}
                                    <button
                                        className="
                                            w-full
                                            border border-customBlue
                                            text-customBlue
                                            px-3 md:px-4 
                                            py-2 md:py-2.5
                                            rounded-lg
                                            cursor-pointer
                                            text-xs md:text-sm font-medium
                                            transition
                                            hover:bg-customBlue/10
                                        "
                                    >
                                        Assign POC Company Manager
                                    </button>

                                    {/* Bottom buttons */}
                                    <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full">
                                        <button
                                            onClick={closeAddClientForm}
                                            className="
                                                flex-1
                                                border border-customBlue
                                                text-customBlue
                                                px-3 md:px-4 
                                                py-2 md:py-2.5
                                                rounded-lg
                                                cursor-pointer
                                                text-xs md:text-sm font-medium
                                                transition
                                                hover:bg-customBlue/10
                                            "
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            className="
                                                flex-1
                                                bg-customBlue
                                                text-gray-100
                                                px-3 md:px-4 
                                                py-2 md:py-2.5
                                                rounded-lg
                                                cursor-pointer
                                                text-xs md:text-sm font-medium
                                                transition
                                                hover:bg-customBlue/90
                                            "
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddClientForm;