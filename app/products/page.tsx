"use client"
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../globals.css";
import {
  Box,
  Flex,
  Text,
  Image,
  SimpleGrid,
  Button,
  useToast,
  Spinner,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  Icon,
} from "@chakra-ui/react";
import { DeleteProduct, GetProducts } from "@/app/lib/api-client";
import { ProductType } from "@/app/lib/schemas";
import { useQuery } from "@tanstack/react-query";
import ProductModal from "../components/EditProductModal";
import { GoInfo } from "react-icons/go";
import { motion } from "framer-motion";
import { IoPersonCircleOutline } from "react-icons/io5";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

function formatString(name: string): string {
  return name.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).replace(/_/g, ' ');
}

export default function GetAllProducts({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): JSX.Element {

  const [loading, setLoading] = useState<boolean>(false);

  const [getData, setData] = useState<ProductType[]>([]);

  const [currentProduct, setCurrentProduct] = useState<ProductType | null>(null);

  const [deletingProduct, setDeletingProduct] = useState<string | null>(null);

  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();

  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();

  const cancelRef = React.useRef<any>();

  const toast = useToast();

  const router = useRouter();

  const session = getCookie("session");

  const nSession = session && JSON.parse(session);

  function formatName(name: string) {
    const nameParts = name.split(' ');
    const firstName = nameParts[0];
    return firstName;
  }


function formatNumber(num: number) {
  return num.toLocaleString('en-US', { style: 'currency', currency: 'GHS' });
}

function formatString(name: string): string {
  return name.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).replace(/_/g, ' ');
}


  useEffect(() => {
    getAllProducts();
  }, []);

  const getAllProducts = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await GetProducts();
      if (data && typeof data === "object") {
        setData(data);
      } else {
        toast({
          title: "Unexpected response format",
          status: "error",
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Couldn't fetch product data. Check your internet connection",
        status: "error",
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (
    name: string,
    category: string
  ): Promise<void> => {
    setDeletingProduct(name);
    try {
      const data = await DeleteProduct({ category, name });
      if (data) {
        toast({
          title: "Success",
          status: "success",
          isClosable: true,
        });
        getAllProducts();
        onDeleteModalClose();
      }
    } catch (error) {
      toast({
        title: "Couldn't delete product. Try again",
        status: "error",
        isClosable: true,
      });
    } finally {
      setDeletingProduct(null);
    }
  };

  return (
    <Flex bg="#F0F4F8" w="100%" h="100dvh">
      <Flex>
        <Navbar />
      </Flex>
      <Flex direction="column" p="30px" w="100%" overflowY="scroll" h="100dvh">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Flex p={4} bg="white" justify="space-between" align="center" borderRadius="lg" boxShadow="sm">
            <Text fontSize="2xl" fontWeight="bold">Products</Text>
            <Flex align="center">
              <Icon as={IoPersonCircleOutline} boxSize={10} color="blue.500" />
              <Text fontWeight={500} ml={2} fontSize="17px">
                {nSession ? formatName(nSession?.name) : "/"}
              </Text>
            </Flex>
          </Flex>
        </motion.div>

        <Flex mt={6} justify="space-between" align="center">
          <Button colorScheme="blue" as="a" href="/products/add">
            + Add new Products
          </Button>
        </Flex>

        {loading ? (
          <Flex height="50vh" alignItems="center" justifyContent="center">
            <Spinner size="xl" />
          </Flex>
        ) : getData.length > 0 ? (
          <SimpleGrid columns={[1, 2, 3, 4]} spacing={6} mt={6}>
            {getData.map((product: ProductType, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="md"
                  p={5}
                  bg="white"
                >
                  <Flex justify="flex-end" mb={2}>
                    <Icon 
                      as={GoInfo} 
                      boxSize={6} 
                      color="blue.500" 
                      cursor="pointer" 
                      onClick={() => router.push(`products/${product.id}`)} 
                    />
                  </Flex>
                  {product.image && (
                    <Image
                      boxSize="150px"
                      objectFit="cover"
                      src={product.image}
                      alt={product.name}
                      mx="auto"
                      mb={4}
                    />
                  )}
                  <Text fontWeight="bold" mb={2}>{formatString(product.name)}</Text>
                  <Text mb={4}>{formatNumber(product.price)}</Text>
                  <Flex justify="space-between">
                    <Button size="sm" onClick={() => {
                      setCurrentProduct(product)
                      onEditModalOpen()
                    }}>
                      Edit
                    </Button>
                    <Button size="sm" colorScheme="red" onClick={() => {
                      setCurrentProduct(product)
                      onDeleteModalOpen()
                    }}>
                      Delete
                    </Button>
                  </Flex>
                </Box>
              </motion.div>
            ))}
          </SimpleGrid>
        ) : (
          <Flex justify="center" align="center" h="50vh" direction="column" gap={5}>
            <Text>No products found</Text>
            <Button onClick={getAllProducts}>
              Refresh
            </Button>
          </Flex>
        )}

        {currentProduct && (
          <ProductModal 
            product={currentProduct} 
            isOpen={isEditModalOpen} 
            onOpen={onEditModalOpen} 
            onClose={() => {
              onEditModalClose()
              setCurrentProduct(null)
            }} 
          />
        )}

        <AlertDialog
          isOpen={isDeleteModalOpen}
          leastDestructiveRef={cancelRef}
          onClose={onDeleteModalClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Delete Product
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can&apos;t undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onDeleteModalClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme='red' ml={3}
                  onClick={() => {
                    currentProduct && deleteProduct(currentProduct?.name, currentProduct?.category)
                  }}
                  isLoading={deletingProduct === currentProduct?.name}
                >
                  {deletingProduct === currentProduct?.name ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Flex>
    </Flex>
  );
}
