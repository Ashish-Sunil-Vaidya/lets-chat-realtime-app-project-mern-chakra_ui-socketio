import {
  FormControl,
  Input,
  FormLabel,
  InputRightElement,
  Button,
  InputGroup,
  IconButton,
} from "@chakra-ui/react";

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const InputField = ({
  type = "text",
  placeholder = "",
  label = "",
  value = "",
  onChange = () => {},
  isRequired = true,
}) => {
  const [show, setShow] = useState(false);

  return (
    <FormControl isRequired={isRequired}>
      <FormLabel m={1}>{label}</FormLabel>
      <InputGroup>
        <Input
          type={type === "password" ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          borderColor="blue.500"
        />
        {type === "password" && (
          <InputRightElement>
            <IconButton
              onClick={() => setShow(!show)}
              colorScheme="blue"
              icon={show ? <FaEyeSlash /> : <FaEye />}
            />
          </InputRightElement>
        )}
      </InputGroup>
    </FormControl>
  );
};

export default InputField;
