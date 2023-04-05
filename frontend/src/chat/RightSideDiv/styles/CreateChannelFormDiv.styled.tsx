import styled from 'styled-components';

export const CreateChannelFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  margin: 50px;
  max-width: 500px;
  margin: auto;

  @media screen and (min-width: 768px) {
    max-width: 700px;
  }

  @media screen and (min-width: 1024px) {
    max-width: 900px;
  }
`;

export const Heading2 = styled.h2`
  font-size: 2rem;
  color: #555;
  margin-bottom: 20px;
  text-align: center;
`;

export const CreateChannelLabel = styled.label`
  font-size: 1rem;
  margin-right: 10px;
  color: #555;
  flex: 1;

  @media screen and (min-width: 768px) {
    margin-right: 20px;
  }
`;

export const CreateChannelInput = styled.input`
  padding: 10px;
  border-radius: 5px;
  background-color: #555;
  border: none;
  margin-bottom: 20px;
  flex: 2;

  @media screen and (min-width: 768px) {
    margin-left: 10px;
    margin-bottom: 0;
  }
  
  @media screen and (min-width: 1024px) {
    flex: 3;
  }
`;

export const CreateChannelSelect = styled.select`
  padding: 10px;
  border-radius: 5px;
  background-color: #555;
  border: none;
  margin-bottom: 20px;
  flex: 2;

  @media screen and (min-width: 768px) {
    margin-left: 10px;
    margin-bottom: 0;
  }
  
  @media screen and (min-width: 1024px) {
    flex: 3;
  }
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
  margin-left: auto;
  margin-right: auto;
  display: block;

  &:hover {
    background-color: #00688B;
  }
`;

export const CreateChannelInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;

  @media screen and (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

export const ErrorMessage = styled.p`
  color: red;
  margin-top: 10px;
  margin-bottom: 20px;
`;

export const ShowPasswordLabel = styled.label`
`;

export const ShowPasswordCheckbox = styled.input`
  margin-right: 8px;
`;
