// "use client";
import BlogList from "@/components/BlogList";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import "react-toastify/dist/ReactToastify.css";

const Blogs = () => {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <BlogList />
      <Footer />
      <Toaster/>
    </main>
  );
};

export default Blogs;
