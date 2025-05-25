import { Button } from '@mui/material';
import { AccountCircle, Lock, School } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/fire';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginDetail, setLoginDetail] = useState({
    name: "",
    password: ""
  });
  const [students, setStudents] = useState([]);
  const [loginStatus, setLoginStatus] = useState(null);  
  const [isLoading, setIsLoading] = useState(false);

  const studentRef = collection(db, "Students"); 

  const loginDetailHandler = (e) => {
    const { name, value } = e.target;
    setLoginDetail((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear any previous login status when user types
    if (loginStatus) setLoginStatus(null);
  };

  const fetchData = async () => {
    try {
      const Extract = await getDocs(studentRef);
      const data = Extract.docs.map((doc) => ({
        studentName: doc.data().studentName?.trim().toLowerCase(),
        phoneNumber: doc.data().phoneNumber
      }));
      setStudents(data);
    } catch (error) {
      console.log(error);
      setLoginStatus('error');
    }
  };
  
  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const inputName = loginDetail.name.trim().toLowerCase();
      const inputPassword = loginDetail.password.trim();
  
      const foundStudent = students.find(student =>
        student.studentName === inputName &&
        student.phoneNumber === inputPassword
      );
  
      if (foundStudent) {
        setLoginStatus('success');
        console.log("Login successful for:", foundStudent);
        setLoginDetail({name:"",password:""});
        navigate(`/student/${loginDetail.name}`)
      } else {
        setLoginStatus('error');
        console.log("Invalid credentials");
      }
    } catch (error) {
      console.log(error);
      setLoginStatus('error');
    } finally {
      setIsLoading(false);
    }
  }; 
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50"> 
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-center md:min-h-screen">
        <School className="text-6xl mb-4" />
        <h1 className="text-4xl font-bold mb-2">Tution Centre Name</h1>
        <p className="text-xl opacity-90">Student Portal</p>
      </div> 
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-semibold mb-4">Welcome Back</h2>
          <p className="text-gray-600 mb-8">Please sign in to access your student dashboard</p>

          <form className="space-y-6" onSubmit={submitHandler}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AccountCircle className="text-gray-400" />
              </div>
              <input
                name='name'
                value={loginDetail.name}
                onChange={loginDetailHandler}
                type="text"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Student Name"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-gray-400" />
              </div>
              <input
                type="password"
                name='password'
                value={loginDetail.password}
                onChange={loginDetailHandler}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Password"
              />
            </div>

            <div className="pt-2">
              <Button
                fullWidth
                type='submit'
                variant="contained"
                color="primary"
                size="large"
                className="py-4 text-lg font-semibold normal-case rounded-lg shadow-md hover:shadow-lg transition"
              >
                Sign In
              </Button>
            </div>

            <div className="relative flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button 
                  type="button"
                  className="text-blue-600 font-semibold hover:text-blue-800 focus:outline-none"
                >
                  Contact Admin
                </button>
              </p> 
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;