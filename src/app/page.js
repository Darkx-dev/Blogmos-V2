"use client"
import { auth } from "@/auth";
import BlogList from "@/components/BlogList";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import axios from "axios";
import React, { useCallback, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  useCallback(() => {
    console.log("Hello world")
  },[])
  return (
    <main className="min-h-screen flex flex-col">
      <ToastContainer theme="dark" />
      <Header />
      <BlogList />
      <Footer />
    </main>
  );
};

export default Home;
