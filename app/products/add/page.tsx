"use client";
import React, { useState } from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Image,
  IconButton,
  Spinner,
  Flex,
  Text,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { CreateProduct } from "@/app/lib/api-client";
import { AddType } from "@/app/lib/schemas";

const AddProducts = () => {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [data, setData] = useState<AddType>({
    name: "",
    price: 0,
    description: "",
    category: "",
    dosage: "",
    image: "",
    weight: "",
    expirationDate: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AddType, string>>>({});

  const handleGoBack = () => {
    router.back(); // Navigates to the previous page
  };

  const validateFields = (): boolean => {
    const newErrors: Partial<Record<keyof AddType, string>> = {};
    let isValid = true;

    Object.entries(data).forEach(([key, value]) => {
      if (!value && key !== 'price') {
        newErrors[key as keyof AddType] = 'This field is required';
        isValid = false;
      }
    });

    if (data.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleProductCreate = async (payload: AddType) => {
    if (!validateFields()) {
      toast({
        title: "Please fill all required fields",
        status: "error",
        isClosable: true,
      });
      return;
    }

    if (isImageLoading) {
      toast({
        title: "Image is still uploading, please wait.",
        status: "info",
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const createdProduct = await CreateProduct(payload);
      if (createdProduct) {
        toast({
          title: "Success",
          status: "success",
          isClosable: true,
        });
        console.log('created product', createdProduct);
        router.back();
      }
    } catch (e: any) {
      toast({
        title: e.message,
        status: "error",
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
  
    if (name === "price") {
      setData((prevData: AddType) => ({ ...prevData, [name]: parseFloat(value) }));
    } else if (name === "image" && files && files[0]) {
      const reader = new FileReader();
      setIsImageLoading(true);
      reader.onloadend = () => {
        const result = reader.result;
        let base64Data: string | undefined;
  
        if (typeof result === "string") {
          base64Data = result.slice(result.indexOf(',') + 1); 
        }
  
        if (base64Data) {
          // Update the state with the base64 image URL
          setData((prevData: AddType) => ({ ...prevData, image: base64Data }));
        }
        setIsImageLoading(false);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setData((prevData: AddType) => ({ ...prevData, [name]: value }));
    }

    // Clear the error for the field being changed
    setErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  
  

  return (
    <Box bg="gray.50" minHeight="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Flex gap={4}>        
            <IconButton
              icon={<ArrowBackIcon />}
              onClick={handleGoBack}
              aria-label="Go back"
              mb={4}
              size="lg"
        />
          <Heading as="h1" size="xl">
            Add New Product
          </Heading>
        
        </Flex>

          <Box bg="white" borderRadius="lg" boxShadow="md" p={6}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              <VStack spacing={6} align="stretch">
                <FormControl>
                  <FormLabel>Product Image</FormLabel>
                  <Box
                    borderWidth={2}
                    borderStyle="dashed"
                    borderRadius="md"
                    p={4}
                    textAlign="center"
                    position="relative"
                    height="300px"
                    overflow="hidden"
                  >
                    <Input
                      id="image"
                      display="none"
                      border="none"
                      type="file"
                      name="image"
                      onChange={handleInputChange}
                      accept="image/*"
                    />
                    {isImageLoading ? (
                      <Spinner />
                    ) : data.image ? (
                      <Flex direction="column" align="center" justify="center" h="100%">
                        <Image
                          src={`data:image/jpeg;base64,${data.image}`}
                          alt="Uploaded Image"
                          objectFit="contain"
                          maxW="100%"
                          maxH="80%"
                          mb={2}
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            setData((prevData) => ({ ...prevData, image: "" }));
                          }}
                        >
                          Remove Image
                        </Button>
                      </Flex>
                    ) : (
                      <Box as="label" htmlFor="image" height="100%" width="100%" display="flex" alignItems="center" justifyContent="center">
                        <Flex
                          border="1px solid #000"
                          p={2}
                          borderRadius={10}
                          cursor="pointer"
                          justifyContent="center"
                          alignItems="center"
                        >
                          Click to upload image
                        </Flex>
                      </Box>
                    )}
                  </Box>
                </FormControl>
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel>Product Name</FormLabel>
                  <Input
                    name="name"
                    value={data.name}
                    onChange={handleInputChange}
                  />
                  {errors.name && <Text color="red.500" fontSize="sm">{errors.name}</Text>}
                </FormControl>
                <FormControl isInvalid={!!errors.description}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={data.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                  {errors.description && <Text color="red.500" fontSize="sm">{errors.description}</Text>}
                </FormControl>
              </VStack>
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={2} spacing={4}>
                  <FormControl isInvalid={!!errors.category}>
                    <FormLabel>Category</FormLabel>
                    <Input
                      name="category"
                      value={data.category}
                      onChange={handleInputChange}
                    />
                    {errors.category && <Text color="red.500" fontSize="sm">{errors.category}</Text>}
                  </FormControl>
                  <FormControl isInvalid={!!errors.dosage}>
                    <FormLabel>Dosage</FormLabel>
                    <Input
                      name="dosage"
                      value={data.dosage}
                      onChange={handleInputChange}
                    />
                    {errors.dosage && <Text color="red.500" fontSize="sm">{errors.dosage}</Text>}
                  </FormControl>
                  <FormControl isInvalid={!!errors.price}>
                    <FormLabel>Price</FormLabel>
                    <Input
                      name="price"
                      type="number"
                      value={data.price}
                      onChange={handleInputChange}
                    />
                    {errors.price && <Text color="red.500" fontSize="sm">{errors.price}</Text>}
                  </FormControl>
                  <FormControl isInvalid={!!errors.weight}>
                    <FormLabel>Weight (kg)</FormLabel>
                    <Input
                      name="weight"
                      value={data.weight}
                      onChange={handleInputChange}
                    />
                    {errors.weight && <Text color="red.500" fontSize="sm">{errors.weight}</Text>}
                  </FormControl>
                </SimpleGrid>
                <FormControl isInvalid={!!errors.expirationDate}>
                  <FormLabel>Expiration Date</FormLabel>
                  <Input
                    name="expirationDate"
                    type="date"
                    value={data.expirationDate}
                    onChange={handleInputChange}
                  />
                  {errors.expirationDate && <Text color="red.500" fontSize="sm">{errors.expirationDate}</Text>}
                </FormControl>
                <Button
                  colorScheme="blue"
                  onClick={() => handleProductCreate(data)}
                  isLoading={loading}
                  loadingText="Submitting"
                  size="lg"
                  width="full"
                  mt={4}
                >
                  Add Product
                </Button>
              </VStack>
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default AddProducts;