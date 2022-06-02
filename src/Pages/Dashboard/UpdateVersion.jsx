import React, {useState, useEffect} from "react";
import styled from "styled-components";
import { cardStyles } from "./ReusableStyles";
import API from "../../api/api";


export default function UpdateVersion() {

  const [Version, setVersion] = useState("");

    
    const token = localStorage.getItem("token");
    function handleClick() {
            API.put(`/vpn/update`, {Version: Version} , { headers: {"Authorization" : `Bearer ${token}`} })
            .then(response => {
                alert(response.data.message)
                window.location.reload()
            })
            .catch(err => {
                console.log(err)
            })
                    
      }
      
  return (
    <Section>
      <div className="top">
        <div className="info">
          <h5>Update version</h5>
          <div className="growth">
            <input
              type="text"
              name="Version"
              className="input"
              placeholder="Input Version"
              value={Version}
              onChange={e => setVersion(e.target.value)}
            />
            <button class="btn third" onClick={handleClick}>Update</button>
          </div>
        </div>
      </div>

    </Section>
  );
}
const Section = styled.section`
  
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 20rem;
    ${cardStyles}
    padding: 2rem 0 0 0;
    .top {
        .info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          h1 {
            font-size: 2rem;
          }
          h5 {
            font-size: 3rem;
          }
          .growth {
            padding: 3rem;
            border-radius: 1rem;
            transition: 0.3s ease-in-out;
            &:hover {
              span {
                color: black;
              }
            }
            span {
              color: #ffc107;
            }
            .third {
              padding-left: 0 2rem 0 0;
              border-color: #3498db;
              color: #fff;
              box-shadow: 0 0 40px 40px $blue inset, 0 0 0 0 #3498db;
              transition: all 150ms ease-in-out;
              
              &:hover {
                box-shadow: 0 0 10px 0 $blue inset, 0 0 10px 4px #3498db;
              }
            }
            
          }
        }
      }
    
    @media screen and (min-width: 280px) and (max-width: 1080px) {
    }
`;
