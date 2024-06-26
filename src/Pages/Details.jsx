/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useContext } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import swal from "sweetalert";
import { Helmet } from "react-helmet";

const Details = () => {
  const details = useLoaderData();

  const { jobTitle, deadline, price, description, _id, email } = details || {};
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const isOwner = user?.email === email;

  const handleSubmit = (e) => {
    const status = "Pending";
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const deadline = form.deadline.value;
    const buyerEmail = form.buyerEmail.value;
    const Bids = {
      email,
      deadline,
      price,
      title: jobTitle,
      buyerEmail,
      status,
    };
    console.log(Bids);
    fetch(`https://skill-swap-hub-server.vercel.app/Bids`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(Bids),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.acknowledged) {
          swal("Well Done", "You Have Successfully Bided", "success");
          navigate("/myBids");
        }
      });
  };

  return (
    <div className=" container mx-auto gap-6 my-16 md:my-20">
      <Helmet>
        <title>Details | {jobTitle}</title>
      </Helmet>
      <div className="card mx-auto bg-white mb-10 border mx-4 md:w-1/2">
        <div className="card-body">
          <h2 className="card-title">{jobTitle}</h2>
          <p>{description}</p>
          <p>Last Date : {deadline}</p>
          <p>Price : {price}</p>
        </div>
      </div>
      <div className="">
          <h2 className="text-3xl font-extrabold text-center mb-6">Add Your Information</h2>
        <div className="border rounded-xl p-4 md:px-16 mx-4 md:py-10">
          <form onSubmit={handleSubmit}>
            <div className="md:flex mb-4">
              <div className="form-control w-full md:w-1/2">
                <label className="label">
                  <span className="label-text ">Expected Price</span>
                </label>
                <label className="input-group">
                  <input
                    type="text"
                    name="price"
                    placeholder="Price"
                    className="input input-bordered w-full"
                    required
                  />
                </label>
              </div>
              <div className="form-control w-full md:w-1/2 md:ml-4">
                <label className="label">
                  <span className="label-text ">Deadline</span>
                </label>
                <label className="input-group">
                  <input
                    type="date"
                    name="deadline"
                    placeholder="Deadline"
                    className="input input-bordered w-full"
                    required
                  />
                </label>
              </div>
            </div>
            <div className="md:flex mb-4">
              <div className="form-control w-full md:w-1/2">
                <label className="label">
                  <span className="label-text ">Your Email</span>
                </label>
                <label className="input-group">
                  <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    className="input input-bordered w-full"
                    defaultValue={user.email}
                    readOnly
                  />
                </label>
              </div>
              <div className="form-control w-full md:w-1/2 md:ml-4">
                <label className="label">
                  <span className="label-text ">Buyer's Email</span>
                </label>
                <label className="input-group">
                  <input
                    type="text"
                    name="buyerEmail"
                    placeholder=""
                    className={`input input-bordered w-full `}
                    defaultValue={email}
                    readOnly
                  />
                </label>
              </div>
            </div>
            <input
            type="submit"
            value="Bid now"
            disabled={isOwner}
            className="btn w-full capitalize btn-sm md:btn-md border-[#6D54FE] bg-white text-[#6D54FE] hover:bg-[#6D54FE] hover:text-white"
          />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Details;
