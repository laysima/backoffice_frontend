"use client";
import {Text, Input, Box, Grid, GridItem, FormControl, FormLabel, FormHelperText, Link , Flex , InputRightElement, InputGroup,Image,
  useToast,
  Button} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import NextLink from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { LoginSchema, LoginType } from "@/app/lib/schemas";
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";
import { LoginUser } from "./lib/api-client";

const Page = () => {
  const [show, setShow] = React.useState(false);

  const handleClick = () => setShow(!show);

  const toast = useToast()

  const router = useRouter();

  const session  = getCookie('session');

  const [loading, setLoading] = useState(false);
  useEffect(()=> {
    if (session) {
      router.replace('/')
    }
  },[]) 

  const { control, handleSubmit, formState: { errors },} = useForm<LoginType>
  (
    {
      resolver:zodResolver(LoginSchema)
    }
  )
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit(onSubmit)();
    }
  };

  const onSubmit = async (payload:LoginType) => {
    setLoading(true)
  
    console.log('payload', payload)
    
    try {
    const data = await LoginUser(payload)
    if (data) {
      if (data.role !== 'admin') {
        toast({
          title: 'Access Denied',
          status: 'error',
          isClosable: true,
        })
      } else {
        setCookie('session', JSON.stringify(data))
        router.replace('/dashboard')
        toast({
          title: 'Success',
          status: 'success',
          isClosable: true,
        })
      }
    }
    } 
    catch (e:any) {
      toast({
        title: e.message,
        status: 'error',
        isClosable: true,
      })
    }
    setLoading(false)

  }

  return (
    <Grid templateColumns="1fr 4fr">
      <GridItem h={"100vh"} bgImage={"url('./hexagon.jpg')"} bgSize={"cover"} bgPos={"center"}>
        <Flex justify={"center"} w={"full"} mt={"100%"}>
          <Text color={"white"} fontSize={"4xl"}>
            ADMIN
          </Text>
        </Flex>
      </GridItem>

      <GridItem h={"100vh"} bg={"white"}>
        <Flex justify={"center"} w={"full"}>
          <Box w={"300px"} mt={"60px"}>
            <Image alt="pharmainc" objectFit={"cover"} src="/pharmainc.svg" />
          </Box>
        </Flex>

        <Flex justify={"center"} w={"full"} mb={10}>
          <FormControl w={"30rem"} p={"62px 28px"} borderRadius={7} as="form" onSubmit={handleSubmit(onSubmit)}>
            <Flex direction={"column"} gap={1}>
              <Text fontWeight={500} fontFamily={'"Outfit", sans-serif'} fontSize={"4xl"}>
                LOGIN
              </Text>
            </Flex>

            <Flex mt={5} direction={"column"} w={"full"} align={"center"}>
              <Flex direction={"column"} align={"start"} w={"full"}>
              <Controller control={control} name={"email"} render={({ field }) => (
                <Input borderRadius={0} boxShadow={"1px 1px 8px 5px #EAEFF2, 0 0 10px #EAEFF2"} h={"7vh"} border={"1px solid #EAEFF2"}
                  type="text" value={field.value} onChange={(e) => field.onChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              )}
              />
                <FormHelperText color={errors.email? 'red' : ''}>
                  { errors.email ? errors.email.message: 'Please Enter Your Email'}
                </FormHelperText>
              </Flex>
            </Flex>

            <Flex mt={8} direction={"column"} w={"full"} align={"center"}>
              <Flex direction={"column"} align={"start"} w={"full"}>
                <InputGroup size="md">
                <Controller control={control} name={"password"} render={({ field }) => (
                  <Input borderRadius={0} boxShadow={"1px 1px 8px 5px #EAEFF2, 0 0 10px #EAEFF2"} h={"7vh"} pr="4.5rem"
                    type={show ? "text" : "password"} value={field.value} onChange={(e) => field.onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                )}
                />
                  <InputRightElement width="4.5rem" mt={2} justifyContent={"center"}>
                    <Button onClick={handleClick} bg={'none'}>
                      {show ? <BsEye /> : <BsEyeSlash />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormHelperText color={errors.password? 'red' : ''}>
                  { errors.password ? errors.password.message: 'Please Enter Your Password'}
                  </FormHelperText>
              </Flex>
            </Flex>

            <Flex justify={"center"} mt={10}>
            <Button colorScheme="blue" type="submit" isLoading={loading}>
              {loading? 'Signing In.....':  "Sign In"}
            </Button>
            </Flex>
          </FormControl>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default Page;
