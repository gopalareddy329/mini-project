import React, { useContext, useState } from 'react';
import NavBar from '../../component/navBar/NavBar';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {registerUser}=useContext(AuthContext)

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!agreeToTerms) {
      setErrorMessage('You must agree to the terms and conditions.');
      return;
    }

    registerUser(e)
    setErrorMessage('');
  };

  return (
    <div className="relative flex size-full  min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Public Sans", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <NavBar/>
        <div className="px-40 flex flex-1 justify-center  w-full py-5">
          <div className="layout-content-container flex flex-col w-full  items-center py-5  flex-1">
            <h1 className="text-[#111517] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">Create an account</h1>
            <form onSubmit={handleFormSubmit}>
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#111517] text-base font-medium leading-normal pb-2">Email</p>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    className="form-input flex  w-[400px] min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111517] focus:outline-0 focus:ring-0 border border-[#dce1e5] bg-white focus:border-[#dce1e5] h-14 placeholder:text-[#647987] p-[15px] text-base font-normal leading-normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required={true}
                  />
                </label>
              </div>
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#111517] text-base font-medium leading-normal pb-2">Password</p>
                  <input
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111517] focus:outline-0 focus:ring-0 border border-[#dce1e5] bg-white focus:border-[#dce1e5] h-14 placeholder:text-[#647987] p-[15px] text-base font-normal leading-normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={true}
                  />
                </label>
              </div>
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#111517] text-base font-medium leading-normal pb-2">Confirm password</p>
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111517] focus:outline-0 focus:ring-0 border border-[#dce1e5] bg-white focus:border-[#dce1e5] h-14 placeholder:text-[#647987] p-[15px] text-base font-normal leading-normal"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={true}
                  />
                </label>
              </div>
              <div className="px-4">
                <label className="flex gap-x-3 py-3 flex-row">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-[#dce1e5] border-2 bg-transparent text-[#1f93e0] checked:bg-[#1f93e0] checked:border-[#1f93e0] focus:ring-0 focus:ring-offset-0 focus:border-[#dce1e5] focus:outline-none"
                    checked={agreeToTerms}
                    onChange={() => setAgreeToTerms(!agreeToTerms)}
                    required={true}
                  />
                  <p className="text-sm font-normal leading-normal">I agree to the terms and conditions.</p>
                </label>
              </div>
              {errorMessage && <p className="text-red-500 px-4">{errorMessage}</p>}
              <div className="px-4 py-3">
                <button
                  type="submit"
                  className="flex w-[50%] h-14 items-center justify-center rounded-xl bg-[#1f93e0] text-white text-sm font-bold tracking-[0.015em] cursor-pointer"
                >
                  Create account
                </button>
              </div>
            </form>
            <div className="px-4">
              <p className="pt-2 pb-3 text-sm font-normal leading-normal">Already have an account? <Link to="/login" className="text-[#1f93e0] font-bold">Log in</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
