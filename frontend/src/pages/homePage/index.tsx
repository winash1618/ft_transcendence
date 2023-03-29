// import { ParentContainer, Label, Input, LabelText } from "./homepage.styled";
import { useState } from 'react';
import { Button, FormContainer, Input, Label, Select, Option } from './homepage.styled';

  const HomePage = () => {
	// const [parentContainerColor, setParentContainerColor] = useState('#fff');
  
	// const handleParentContainerClick = () => {
	//   setParentContainerColor('#0af');
	// };
  
	return (<>
	
		{/* <Label>
		<Input defaultChecked />
		<LabelText $mode="dark">Foo</LabelText>
	  </Label>
	  <Label>
		<Input />
		<LabelText $mode="dark">Foo</LabelText>
	  </Label>
	  <Label>
		<Input defaultChecked />
		<LabelText $mode="dark">Foo</LabelText>
	  </Label>
	  <Label>
		<Input defaultChecked />
		<LabelText $mode="dark">Foo</LabelText>
	  </Label> */}
	   <FormContainer>
      <Label htmlFor="channel-name">Channel Name:</Label>
      <Input type="text" id="channel-name" name="channel-name" required />

      <Label htmlFor="channel-status">Channel Status:</Label>
      <Select id="channel-status" name="channel-status" required>
        <Option value="">Select status</Option>
        <Option value="private">Private</Option>
        <Option value="public">Public</Option>
        <Option value="protected">Protected</Option>
      </Select>

      <Button type="submit">Submit</Button>
    </FormContainer>
	</>
	);
  };
  
  export default HomePage;
  