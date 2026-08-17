"use client";
import React from "react";
import Navbar from "../components/Navbar";
import "../globals.css";
import { Flex, Box, Text, Image, Grid, GridItem, Icon, Button, StatGroup, Stat, StatLabel, StatNumber, StatArrow, StatHelpText } from "@chakra-ui/react";
import { MdOutlineListAlt, MdSearch } from "react-icons/md";
import { TbShoppingBagX } from "react-icons/tb";
import { TiMessages } from "react-icons/ti";
import WeekChart from "../components/WeekChart";
import PieChart from  "../components/PieChart";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { BiLogOut } from "react-icons/bi";
import { IoPersonCircleOutline } from "react-icons/io5";
import DataTableDemo from "../components/DataTableDemo";
import { motion } from "framer-motion";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { GetAllOrders } from "../lib/api-client";


const Dashboard = () => {
  
  const { data: orders, isPending, isRefetching } = useQuery({
    queryKey: ['GetAllOrders'], 
    queryFn: () => GetAllOrders()
  })


  const router = useRouter();

  const session = getCookie("session");
  const nSession = session && JSON.parse(session);

  const handleLogout = () => {
    deleteCookie("session");
    router.replace("/");
  };

  function formatName(name: string) {
    const nameParts = name.split(' ');
    const firstName = nameParts[0];
    return firstName;
  }

  const total = orders?.reduce(
    (sum: number, order: any) =>
      sum + order.totalCost,
    0
  )

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
            <Text fontSize="2xl" fontWeight="bold">Dashboard</Text>
            <Flex align="center">
              <Icon as={IoPersonCircleOutline} boxSize={10} color="blue.500" />
              <Text fontWeight={500} ml={2} fontSize="17px">
                {nSession ? formatName(nSession?.name) : "/"}
              </Text>
            </Flex>
          </Flex>
        </motion.div>

        <Grid
          w="100%"
          pt="30px"
          templateColumns="repeat(3, 1fr)"
          gap={6}
        >
          {[
            { label: "Total Sales", value: total?.toFixed(2), icon: RiMoneyDollarCircleLine, change: 23.36, up: true },
            { label: "Order Per Month", value: orders?.length, icon: MdOutlineListAlt, change: 23.36, up: false },
            { label: "Total Orders", value:orders?.length, icon: TbShoppingBagX, change: 4.36, up: true },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Box p={6} bg="white" borderRadius="lg" boxShadow="md">
                <Flex justify="space-between" align="center" mb={4}>
                  <Icon as={item.icon} boxSize={10} color="blue.500" />
                  <Stat>
                    <StatLabel fontSize="sm" color="gray.500">{item.label}</StatLabel>
                    <StatNumber fontSize="3xl">{item.value}</StatNumber>
                    <StatHelpText
                      display="flex"
                      alignItems="center"
                      color={item.up ? "green.500" : "red.500"}
                    >
                      <Icon as={item.up ? FiTrendingUp : FiTrendingDown} mr={1} />
                      {item.change}%
                    </StatHelpText>
                  </Stat>
                </Flex>
              </Box>
            </motion.div>
          ))}
        </Grid>

        <Grid
          w="100%"
          mt={8}
          templateColumns="3fr 1fr"
          gap={6}
        >
          <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>Weekly Sales Overview</Text>
            <WeekChart />
          </Box>
          <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
            <Text fontSize="xl" fontWeight="bold" mb={4}>Sales Distribution</Text>
            <PieChart />
          </Box>
        </Grid>

        <Box mt={8} bg="white" p={6} borderRadius="lg" boxShadow="md">
          <Text fontSize="xl" fontWeight="bold" mb={4}>Top Selling Products</Text>
          <DataTableDemo />
        </Box>
      </Flex>
    </Flex>
  );
};

export default Dashboard;
