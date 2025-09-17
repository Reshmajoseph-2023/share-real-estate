import React, { useState } from "react";
import AddLocation from "../AddLocation/AddLocation";
import { Container,Modal, Stepper } from "@mantine/core";

const AddPropertyModal = ({ opened, setOpened }) => {
      const [active, setActive] = useState(0);
    return (
        <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            closeOnClickOutside
            size={"90rem"}
        >
            <Container h={"40rem"} w={"100%"}>

                <Stepper active={active} onStepClick={setActive}
                breakpoint="sm"
               
                
                >
                    <Stepper.Step
                        label="Location"
                        description="Address">
                       <AddLocation/>
                    
                        Step 1 content: Create an account
                    </Stepper.Step>
                    <Stepper.Step
                        label="Second step"
                        description="Verify email"
                    >
                        Step 2 content: Verify email
                    </Stepper.Step>
                    <Stepper.Step
                        label="Final step"
                        description="Get full access"
                      
                    ></Stepper.Step>
                </Stepper>
            </Container>
        </Modal>
    );
};

export default AddPropertyModal





//mantine.dev/core/stepper/