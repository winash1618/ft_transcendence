import styled from 'styled-components';

export const CreateChannelFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px;
`;

export const CreateChannelLabel = styled.label`
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

export const CreateChannelInput = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: none;
  margin-bottom: 20px;
`;

export const CreateChannelSelect = styled.select`
  padding: 10px;
  border-radius: 5px;
  border: none;
  margin-bottom: 20px;
`;

export const CreateChannelOption = styled.option`
  font-size: 1rem;
`;

export const CreateChannelButton = styled.button`
  padding: 10px 20px;
  background-color: #008CBA;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #00688B;
  }
`;