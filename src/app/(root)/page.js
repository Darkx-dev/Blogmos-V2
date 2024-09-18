import NavBar from "@/components/NavBar";
import React from "react";

const Home = () => {
  return (
    <>
      <header className="h-[60px]">
        <NavBar />
      </header>
      <section className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center">
        <h1 className="text-9xl">BLOGMOS</h1>
        <p className="text-center italic">
          Explore the cosmos of your desire in seconds
        </p>
      </section>
      <section>
        
      </section>
    </>
  );
};

export default Home;
