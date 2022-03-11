import React from "react";

import { GetStaticProps } from "next";

import { fetchUserReadme } from "../lib/UserataFetch";
import HeroComponent from "../components/Hero";
import About from "../components/About";
import Repo from "../components/Repo";
import NavComponent from "../components/NavComponent";
import Blog from "../components/Blog";
import Footer from "../components/Footer";

const username = process.env.NEXT_PUBLIC_USERNAME;

export default function PortfolioPage({
  devData,
  githubRepoData,
  githubUserData,
}: any) {
  // const {saveData}:any = useSaveData();
  console.log(username);
  const [data, setData] = React.useState<string | null>("");

  React.useEffect(() => {
    async function GtihubReadMe() {
      const github = await fetchUserReadme(`${username}`);

      setData(github);
    }
    GtihubReadMe();
  }, []);
  console.log(devData);
  return (
    <div>
      {devData.length === 0 ? (
        <NavComponent name={githubUserData.name} blog={true} />
      ) : (
        <NavComponent name={githubUserData.name} blog={false} />
      )}

      <HeroComponent
        name={githubUserData.name}
        image={githubUserData.avatar_url}
        summary={githubUserData.bio}
      />
      <About data={data!} />
      {devData.length === 0 ? "" : <Blog devData={devData} />}

      <Repo githubRepoData={githubRepoData} />
      <Footer username={githubUserData.name} />
    </div>
  );
}
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const devCommunity = await fetch(
    //@ts-ignore
    `https://dev.to/api/articles?username=${username}`
  );
  const githubUser = await fetch(
    //@ts-ignore
    `https://api.github.com/users/${username}`
  );
  const githubRepo = await fetch(
    //@ts-ignore
    `https://api.github.com/users/${username}/repos?per_page=20`
  );

  const githubUserData = await githubUser.json();
  const githubRepoData = await githubRepo.json();
  const devData = await devCommunity.json();
  return { props: { devData, githubRepoData, githubUserData } };
};
