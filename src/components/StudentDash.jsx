import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../config/fire";
import { useParams } from "react-router-dom";
import { Divider } from "@mui/material";
import { idID } from "@mui/material/locale";

export const StudentDash = () => {
  const { name } = useParams();
  const [isInfoDetail, setInfoDetail] = useState(true);
  const [isFeeDetail, setFeeDetail] = useState(false);
  const [isAttendanceDetail, setAttendanceDetail] = useState(false);
  const [infoData, setInfoData] = useState(null);
  const [feeData, setFeeData] = useState([]);
  const [attendaceData, setAttendanceData] = useState([]);
  const openInfoDetail = () => {
    setInfoDetail(true);
    setFeeDetail(false);
    setAttendanceDetail(false);
  };

  const openFeeDetail = () => {
    setInfoDetail(false);
    setFeeDetail(true);
    setAttendanceDetail(false);
  };

  const openIsAttendanceDetail = () => {
    setInfoDetail(false);
    setFeeDetail(false);
    setAttendanceDetail(true);
  };

  const studentBioData = async () => {
    const student = doc(db, "Students", name);
    try {
      const Extract = await getDoc(student);
      if (Extract.exists()) {
        const bio = Extract.data();
        setInfoData(bio);
      } 
    } catch (error) {
      console.log(error);
    }
  };

  const studentFeeData = async () => {
    const feeRef =  collection(db, "Students",name,"feeDetail")
    try {
      const Extract = await getDocs(feeRef);
      const fetchFee = Extract.docs.map((doc)=>({...doc.data(),id:doc.id}))
      console.log(fetchFee);
      setFeeData(fetchFee);
    } catch (error) {
      console.log(error);
    }
  }

  const studentAttendanceData = async () => {
    const attendanceRef = collection(db, "Students", name, "Attendance");
    try {
      const Extract = await getDocs(attendanceRef);
      const fetchAttendance = Extract.docs.flatMap(doc => {
        const attendanceArray = doc.data().Attendance || [];
        return attendanceArray.map((item, index) => ({
          ...item,
          id: `${doc.id}-${index}`  
        }));
      });
      console.log("Attendance data:", fetchAttendance);
      setAttendanceData(fetchAttendance);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    studentBioData();
    studentFeeData();
    studentAttendanceData();
  }, [name]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
  {/* Sidebar */}
  <div className="bg-white shadow-md md:h-auto md:min-h-screen md:w-64 w-full p-4 flex flex-col">
    <h1 className="text-xl font-bold text-center text-blue-600 mb-6 py-2 border-b border-gray-200">
      {name}
    </h1>
    <div className="space-y-3">
      <button
        onClick={openInfoDetail}
        className={`w-full py-3 px-4 rounded-lg transition duration-300 flex items-center ${isInfoDetail ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Student Info
      </button>
      <button
        onClick={openFeeDetail}
        className={`w-full py-3 px-4 rounded-lg transition duration-300 flex items-center ${isFeeDetail ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Fee Details
      </button>
      <button
        onClick={openIsAttendanceDetail}
        className={`w-full py-3 px-4 rounded-lg transition duration-300 flex items-center ${isAttendanceDetail ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Attendance
      </button>
    </div>
  </div>

  {/* Main content */}
  <div className="flex-1 p-4 md:p-8">
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {isInfoDetail && infoData && (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{name}'s Bio Details</h1>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Student ID: {infoData.studentId || 'N/A'}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Personal Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium text-gray-600">Student Name:</span> {infoData.studentName}</p>
                <p><span className="font-medium text-gray-600">Father Name:</span> {infoData.fatherName}</p>
                <p><span className="font-medium text-gray-600">Date of Join:</span> {infoData.Date}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Academic Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium text-gray-600">School Name:</span> {infoData.schoolName}</p>
                <p><span className="font-medium text-gray-600">Class/Grade:</span> {infoData.class || 'N/A'}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Subjects</h2>
            <div className="flex flex-wrap gap-2">
              {infoData.subjects?.map((sub, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {sub}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {isFeeDetail && (
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Monthly Fee Details</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feeData.map((data, id) => (
                  <tr key={id} className={id % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {data.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {data.paymentType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{data.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-700">Total Paid</h3>
              <span className="font-bold text-lg text-blue-700">
                ${feeData.reduce((sum, item) => sum + parseFloat(item.amount), 0)}
              </span>
            </div>
          </div> */}
        </div>
      )}
      
      {isAttendanceDetail && (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-800 mb-6">Attendance Record</h1>
    {attendaceData.length === 0 ? (
      <p className="text-gray-600">No attendance data found.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incharge</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendaceData.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {item.date || item.Date || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status?.toLowerCase() === "present"
                        ? "bg-green-100 text-green-800"
                        : item.status?.toLowerCase() === "absent"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.status || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {item.AttendanceIncharge || item.incharge || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}

    </div>
  </div>
</div>
  );
};
