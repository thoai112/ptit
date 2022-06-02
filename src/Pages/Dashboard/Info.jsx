import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BsFillCalendar2WeekFill } from "react-icons/bs";
import { IoStatsChart } from "react-icons/io5";
import { BiGroup } from "react-icons/bi";
import { FiActivity } from "react-icons/fi";
import { cardStyles } from "./ReusableStyles";
import API from "../../api/api"
export default function Info() {
  const token = localStorage.getItem("token");
  const [user, setusers] = useState([]);
  const [server, setsvs] = useState([]);
  const [network, setnetwork] = useState([]);
  const [version, setversion] = useState([]);


  const GetEmployeeData = () => {

    API.get("/api/", { headers: {"Authorization" : `Bearer ${token}`} })
        .then(response => {
          setusers(response.data)
        })
        .catch(err => {
            console.log(err)
        })
  }
    const GetServerData = () => {

      API.get("/server/getserver", { headers: {"Authorization" : `Bearer ${token}`} })
          .then(response => {
              setsvs(response.data)
          })
          .catch(err => {
              console.log(err)
          })
  }
  const GetNetworkrData = () => {

    API.get("/network/getnetwork", { headers: {"Authorization" : `Bearer ${token}`} })
        .then(response => {
            setnetwork(response.data)
        })
        .catch(err => {
            console.log(err)
        })
  }
  const GetVersion = () => {

    API.get("/vpn/getall")
        .then(response => {
            setversion(response.data)
        })
        .catch(err => {
            console.log(err)
        })
  }
  let result = version.map(a => a.Version);
  useEffect(() => {
    GetEmployeeData();
    GetServerData();
    GetNetworkrData();
    GetVersion();
}, [])
  return (
    <Section>
      <div className="analytic ">
        <div className="content">
          <h5>Version</h5>
          <h2>{result}</h2>
        </div>
        <div className="logo">
          <BsFillCalendar2WeekFill />
        </div>
      </div>
      <div className="analytic">
        <div className="logo">
          <IoStatsChart />
        </div>
        <div className="content">
          <h5>Servers</h5>
          <h2>{server.length}</h2>
        </div>
      </div>
      <div className="analytic">
        <div className="logo">
          <BiGroup />
        </div>
        <div className="content">
          <h5>Users</h5>
          <h2>{user.length}</h2>
        </div>
      </div>
      <div className="analytic ">
        <div className="content">
          <h5>Networks</h5>
          <h2>{network.length}</h2>
        </div>
        <div className="logo">
          <FiActivity />
        </div>
      </div>
    </Section>
  );
}
const Section = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  .analytic {
    ${cardStyles};
    padding: 1rem;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    gap: 1rem;
    transition: 0.5s ease-in-out;
    &:hover {
      background-color: #1c4ed6;
      color: black;
      svg {
        color: white;
      }
    }
    .logo {
      background-color: black;
      border-radius: 3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1.5rem;
      svg {
        font-size: 1.5rem;
      }
    }
  }

  @media screen and (min-width: 280px) and (max-width: 720px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    .analytic {
      &:nth-of-type(3),
      &:nth-of-type(4) {
        flex-direction: row-reverse;
      }
    }
  }
`;
