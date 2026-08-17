'use client'
import { EditProductSchema, EditType } from '@/app/lib/schemas'
import {
  Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton,
  ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast, VStack, HStack,
  Box, Image, Textarea, IconButton
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'
import { EditProduct } from '../lib/api-client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FiUpload } from 'react-icons/fi'

type ProductModalProps = {
  product: any,
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  }

const ProductModal = ({ product, isOpen, onOpen, onClose }: ProductModalProps) => {

const initialRef = useRef(null)

const finalRef = useRef(null)

const router = useRouter();

const toast = useToast();

const [loading, setLoading] = useState(false);

const [currentProduct, setCurrentProduct] = useState(false)

const [isImageLoading, setIsImageLoading] = useState(false);

const { control, handleSubmit, formState: { errors },} = useForm<EditType>
(
  {
    resolver:zodResolver(EditProductSchema)
  }
)

const handleGoBack = () => {
  router.back(); // Navigates to the previous page
};


const [data, setData] = useState(product);

console.log(data)

const handleProductEdit = async (payload: any) => {
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
    console.log({...payload, oldName:payload.name, oldCategory:payload.category})
    const createdProduct = await EditProduct({...payload, oldName:payload.name, oldCategory:payload.category});
    if (createdProduct) {
      toast({
        title: "Success",
        status: "success",
        isClosable: true,
      });
      console.log('created product', createdProduct);
      onClose(); 
      window.location.reload()
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

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value, files } = e.target as HTMLInputElement;

  if (name === "price") {
    setData((prevData: EditType) => ({ ...prevData, [name]: parseFloat(value) }));
  } else if (name === "image" && files && files[0]) {
    const reader = new FileReader();
    setIsImageLoading(true);
    reader.onloadend = () => {
      const result = reader.result;
      let base64Data: string | undefined;

      if (typeof result === "string") {
        base64Data = result.slice(result.indexOf(',') + 1); 
      } else if (result instanceof ArrayBuffer) {
        console.warn("ArrayBuffer detected for image upload. Conversion required.");
      }

      if (base64Data) {
        setData((prevData: EditType) => ({ ...prevData, image: base64Data }));
      }
      setIsImageLoading(false);
    };
    reader.readAsDataURL(files[0]);
  } else {
    setData((prevData: EditType) => ({ ...prevData, [name]: value }));
  }
};
  
  return (
    <>

<FormControl>
    {/* <Button onClick={onOpen} colorScheme='green'>Edit</Button> */}
   
    <Modal initialFocusRef={initialRef} finalFocusRef={finalRef}
      isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxWidth="900px">
        <ModalHeader bg="blue.500" color="white" borderTopRadius="md">Edit Drug Info</ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody py={6}>
          <HStack align="flex-start" spacing={8}>
            <VStack spacing={6} flex={1}>
              <Box
                borderWidth={2}
                borderStyle="dashed"
                borderColor="gray.300"
                borderRadius="md"
                p={4}
                w="full"
                textAlign="center"
                position="relative"
                height="200px"
              >
                {data.image ? (
                  <Image src={`data:image/jpeg;base64,${data.image}`} alt="Product" objectFit="cover" w="full" h="full" />
                ) : (
                  <VStack justify="center" h="full">
                    <FiUpload size="40px" color="gray.400" />
                    <FormLabel htmlFor="image" mb={0} cursor="pointer">
                      Upload Image
                    </FormLabel>
                  </VStack>
                )}
                <Input
                  id="image"
                  type="file"
                  name="image"
                  onChange={handleInputChange}
                  accept="image/*"
                  opacity={0}
                  position="absolute"
                  top={0}
                  left={0}
                  w="full"
                  h="full"
                  cursor="pointer"
                />
              </Box>
              <FormControl>
                <FormLabel fontWeight="bold">Description:</FormLabel>
                <Textarea
                  name="description"
                  value={data.description}
                  onChange={handleInputChange}
                  rows={4}
                  resize="vertical"
                />
              </FormControl>
            </VStack>
            <VStack spacing={4} flex={1}>
              <HStack w="full" spacing={4}>
                <FormControl flex={1}>
                  <FormLabel fontWeight="bold">New Name:</FormLabel>
                  <Input name="newName" value={data.newName} onChange={handleInputChange} />
                </FormControl>
                <FormControl flex={1}>
                  <FormLabel fontWeight="bold">New Category:</FormLabel>
                  <Input name="newCategory" value={data.newCategory} onChange={handleInputChange} />
                </FormControl>
              </HStack>
              <HStack w="full" spacing={4}>
                <FormControl flex={1}>
                  <FormLabel fontWeight="bold">Price:</FormLabel>
                  <Input name="price" type="number" value={data.price} onChange={handleInputChange} />
                </FormControl>
                <FormControl flex={1}>
                  <FormLabel fontWeight="bold">Weight:</FormLabel>
                  <Input name="weight" value={data.weight} onChange={handleInputChange} />
                </FormControl>
              </HStack>
              <HStack w="full" spacing={4}>
                <FormControl flex={1}>
                  <FormLabel fontWeight="bold">Dosage:</FormLabel>
                  <Input name="dosage" value={data.dosage} onChange={handleInputChange} />
                </FormControl>
                <FormControl flex={1}>
                  <FormLabel fontWeight="bold">Expiration Date:</FormLabel>
                  <Input name="expirationDate" type="date" value={data.expirationDate} onChange={handleInputChange} />
                </FormControl>
              </HStack>
              <FormControl>
                <FormLabel fontWeight="bold">Old Name:</FormLabel>
                <Input name="oldName" value={data.name} isReadOnly bg="gray.100" />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="bold">Old Category:</FormLabel>
                <Input name="oldCategory" value={data.category} isReadOnly bg="gray.100" />
              </FormControl>
            </VStack>
          </HStack>
        </ModalBody>
        <ModalFooter bg="gray.50" borderBottomRadius="md">
          <Button colorScheme="blue" mr={3} onClick={() => handleProductEdit(data)} isLoading={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button onClick={onClose} variant="outline">Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
</FormControl>
  </>
  )
}

export default ProductModal