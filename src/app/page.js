"use client";
import BlogList from "@/components/BlogList";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
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
