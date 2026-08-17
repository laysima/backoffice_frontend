import React from "react";
import {
  Flex,
  Text,
  Button,
  Image,
  Input,
  Box,
  InputGroup,
  InputRightElement,
  Icon,
} from "@chakra-ui/react";
import { FiPackage } from "react-icons/fi";
import { LiaTelegram } from "react-icons/lia";
import Navbar from "../components/Navbar";

const chat = () => {
  return (
    <>
      <Flex bg={"#F9F9F8"} h={"100vh"}>
        <Flex>
          <Navbar />
        </Flex>
        <Flex direction={"column"} p={"30px"}>
          <Flex
            p={3}
            gap={800}
            bg={"white"}
            justify={"center"}
            align={"center"}
          >
            <Text>Chat</Text>
            <Button p={2} bg={"#05A1F8"} color={"white"} borderRadius={0}>
              Chat With A Customer
            </Button>
          </Flex>

          <Flex gap={10}>
            <Flex direction={"column"} mt={5}>
              <Input borderRadius={100} border={"0.5px solid black"} w={290} />
              <Flex direction={"column"} mt={2}>
                <Flex p={3} alignItems={"center"} bg={"#B8E0F7"} w={290} mt={3}>
                  <Box w={"50px"}>
                    <Image
                      src="/m1.jpg"
                      borderRadius={100}
                      objectFit={"cover"}
                    />
                  </Box>

                  <Text borderRadius={100}>User 1</Text>
                </Flex>
              </Flex>

              <Flex direction={"column"} mt={2}>
                <Flex p={3} alignItems={"center"} bg={"#B8E0F7"} w={290} mt={3}>
                  <Box w={"50px"}>
                    <Image
                      src="/m1.jpg"
                      borderRadius={100}
                      objectFit={"cover"}
                    />
                  </Box>

                  <Text borderRadius={100}>User 1</Text>
                </Flex>
              </Flex>

              <Flex direction={"column"} mt={2}>
                <Flex p={3} alignItems={"center"} bg={"#B8E0F7"} w={290} mt={3}>
                  <Box w={"50px"}>
                    <Image
                      src="/m1.jpg"
                      borderRadius={100}
                      objectFit={"cover"}
                    />
                  </Box>

                  <Text borderRadius={100}>User 1</Text>
                </Flex>
              </Flex>
            </Flex>

            <Flex bg={"white"} w={"100%"} h={"75vh"} p={3} direction={"column"}>
              <Flex
                alignItems={"center"}
                mt={4}
                direction={"column"}
                ml={"-550px"}
              >
                <Flex>
                  <Box w={"50px"}>
                    <Image
                      src="/m1.jpg"
                      borderRadius={100}
                      objectFit={"cover"}
                    />
                  </Box>

                  <Text borderRadius={100}>User 1</Text>
                </Flex>

                <Flex mt={5} alignItems={"center"} gap={4}>
                  <Text
                    w={"70px"}
                    borderRadius={100}
                    p={2}
                    textAlign={"center"}
                    bg={"#F9F9F8"}
                  >
                    Hey
                  </Text>
                </Flex>
              </Flex>
              <Flex textAlign={"right"} justifyContent={"right"}>
                <Text p={3} borderRadius={"50px"} bg={"#C3EEB8"}>
                  Hey
                </Text>
              </Flex>

              <Flex mt={"340px"}>
                <InputGroup>
                  <Input placeholder="type a message" />
                  <InputRightElement>
                    <button style={{ fontSize: "20px" }}>
                      <LiaTelegram />
                    </button>
                  </InputRightElement>
                </InputGroup>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default chat;
