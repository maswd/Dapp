import React, { useEffect, useState } from "react";
import StudentRegistry from "../../server/artifacts/contracts/StudentRegistry.sol/StudentRegistry.json";
import NFTABI from "../../server/artifacts/contracts/NFT.sol/CERTNFT.json";
import { useContract } from "@thirdweb-dev/react";
import contrcatAddress from "../../server/contrcatAddress.json";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import { NFTs } from "./components/RenderNft";
import { NotificationManager } from "react-notifications";
import "./dashboard.css"
import {
  generate_metadata,
  pinFileToIPFS,
  pinata_api_key1,
  pinata_secret_api_key1,
} from "./NFT/ipfs";
import Table from "./components/Table.jsx";
import ModalAdd from "./components/ModalAdd";
import ModalTransfer from "./components/ModalTransfer";
function Dashboard() {
  const [studentRegistryContract, setContract] = useState(null);
  const [nftContract, setContract2] = useState(null);
  const [students, setStudents] = useState(null);
  const [tokenurls, settokenurls] = useState(null);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [degree, setDegree] = useState("");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [tokenId, setTokenId] = useState("");

  const { data } = useContract(
    contrcatAddress.StudentRegistryContractAddress,
    StudentRegistry.abi
  );

  const { contract } = useContract(
    contrcatAddress.NFTContract,
    NFTABI.abi
  );
  function existestudent(list, _firstName, _lastName) {
    list.forEach((element) => {
      if (element.firstName == _firstName && element.lastName == _lastName) {
        console.log(element.firstName);
        return true;
      }
    });
    return false;
  }

  useEffect(() => {
    if (studentRegistryContract != null) {
      handleReadStudent();
      getalltokenurl();
    }

    if (data) {
      setContract(data.contractWrapper.writeContract);
      setContract2(contract.contractWrapper.writeContract);
    }
  }, [data, contract, studentRegistryContract]);

  const handleCreateStudent = async (
    _firstName,
    _lastName,
    _degree,
    _major,
    _year
  ) => {
    try {
      if (
        firstName.trim() === "" ||
        lastName.trim() === "" ||
        degree.trim() === "" ||
        major.trim() === "" ||
        year.trim() === ""
      ) {
        NotificationManager.error("لطفا تمامی فیلدها را پر کنید");
        return;
      }

      setLoading(true);
      const res = await studentRegistryContract.getAallStudents();
      if (existestudent(res, firstName, lastName)) {
        //اگر دانشجو قبلا وجود داشت پیامی را نشان دهد
        console.log("alrady exist sudent");
        NotificationManager.error("alrady exist sudent");

        setLoading(false);
      } else {
        const tax = await studentRegistryContract.createStudent(
          firstName,
          lastName,
          degree,
          major,
          year
        );
        console.log("data studentcreate :" + year + firstName + lastName);
        const receipt = await tax.wait();
        const evnets = receipt.events[0].args;
        console.log("evnets", evnets);

        if (evnets["code"] === "ACTION_CONFIRME") {
          NotificationManager.success("!تراکنش انجام شد");
        
        }
        console.log(tax, "tax");
        //اطلاعات تراکنش را به کاربر نشان دهد
        console.log("evnets", evnets);
        console.log("receipt", receipt);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      if (err.code === "ACTION_REJECTED") {
        NotificationManager.error("!تراکنش پذیرفته نشد");
      }
    }
  };

  const handelCreatenft = async (student) => {
    console.log(
      student.firstName,
      student.lastName,
      student.education.degree,
      student.education.major,
      parseInt(student.education.year)
    );
    const metadata = generate_metadata(
      student.firstName,
      student.lastName,
      student.education.degree,
      student.education.major,
      parseInt(student.education.year)
    );
    const response = await pinFileToIPFS(
      metadata,
      pinata_api_key1,
      pinata_secret_api_key1,
      student.firstName
    );
    const IpfsHash = response.data.IpfsHash;
    console.log(IpfsHash);
    const tx = await nftContract.mint(IpfsHash);
    console.log(tx);
    const receipt = await tx.wait();
    console.log(receipt);
    const tokenId = receipt.events[1].args[1];
    console.log(parseInt(tokenId._hex, 16));
    const tokenURI = await nftContract.tokenURI(tokenId);
    console.log(tokenURI);
  };

  const handleReadStudent = async () => {
    const res = await studentRegistryContract.getAallStudents();
    setStudents(res);
    console.log("student: ", students);
  };

  const getalltokenurl = async function () {
    const result = await nftContract.getAllTokenIdsAndUrls();
    settokenurls(result[1]);
    console.log(tokenurls);
  };
  const transfer = async function (from, to, tokenId) {
    //انتقال ان اف تی به کاربران
    const tx2 = await nftContract.transferFrom(from, to, tokenId);
    const receipt2 = tx2.wait();
    console.log(receipt2);
  };
  return (
    <div>
      <div style={{direction:"ltr"}} className="d-flex gap-2 align-content-center my-2">
        <button
          type="button"
          className="btn border d-flex align-items-center  shadow"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal2"
        >
          انتقال
                  </button>

        <button
          type="button"
          className="btn btn-primary border d-flex align-items-center shadow "
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          <i class="fa fa-plus pe-1"></i>
                  افزودن 
        </button>
      </div>
      <div className="container">
        <div className="row">
          {students !== null ? (
            <Table students={students} funcs={{ handelCreatenft }} />
          ) : (
            <div
              className="spinner-border text-light p-4 mx-auto my-3 "
              role="status"
            />
          )}
        </div>
      </div>

      <div className="row">
        <div className="container">
          <NFTs />
        </div>
      </div>

      <ModalAdd
        handleCreateStudent={handleCreateStudent}
        loading={loading}
        funcs={{
          setFirstName,
          firstName,
          lastName,
          setLastName,
          degree,
          setDegree,
          major,
          setMajor,
          year,
          setYear,
          setLoading,
        }}
      />

      <ModalTransfer
        transfer={transfer}
        funcs={{ from, setFrom, to, setTo, tokenId, setTokenId }}
      />
    </div>
  );
}

export default Dashboard;
