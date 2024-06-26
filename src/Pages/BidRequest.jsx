/* eslint-disable react/no-unescaped-entities */
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import axios from "axios";
import { Helmet } from "react-helmet";

const BidRequest = () => {
  const { user } = useContext(AuthContext);
  const [bidReq, setBidReq] = useState();
  // const [active, setActive] = useState(false);

  const isActive = (status) => status === "Pending";
  const handleAccept = (id) => {
    const status = { status: "In Progress" };
    axios
      .put(`https://skill-swap-hub-server.vercel.app/BidReq/${id}`, status)
      .then((res) => {
        console.log(res.data);
        if (res.data.modifiedCount > 0) {
          const remaining = bidReq?.filter((newBid) => newBid._id !== id);
          const updated = bidReq?.find((updateBid) => updateBid._id === id);
          updated.status = "In Progress";
          const newBidData = [updated, ...remaining];
          setBidReq(newBidData);
        }
      });
  };

  const handleReject = (id) => {
    const status = { status: "Canceled" };
    axios
      .put(`https://skill-swap-hub-server.vercel.app/BidReq/${id}`, status)
      .then((res) => {
        console.log(res.data);
        if (res.data.modifiedCount > 0) {
          const remaining = bidReq?.filter((newBid) => newBid._id !== id);
          const updated = bidReq?.find((updateBid) => updateBid._id === id);
          updated.status = "Canceled";
          const newBidData = [updated, ...remaining];
          setBidReq(newBidData);
        }
      });
  };

  useEffect(() => {
    fetch(
      `https://skill-swap-hub-server.vercel.app/BidReq?buyerEmail=${user.email}`
    )
      .then((res) => res.json())
      .then((data) => {
        setBidReq(data);
      });
  }, [user]);

  console.log(bidReq);
  return (
    <div className="my-16 md:my-20">
      <Helmet>
        <title>Bid Request Page</title>
      </Helmet>
      {bidReq?.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg p-4 container mx-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Email</th>
                <th>Job Title</th>
                <th>Price</th>
                <th>Deadline</th>
                <th>Status</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {bidReq?.map((bid) => (
                <tr key={bid._id}>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-bold">{bid.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {bid.title}
                    <br />
                  </td>
                  <td>
                    {bid.price}
                    <br />
                  </td>
                  <td>{bid.deadline}</td>
                  <th>
                    <button className="btn btn-ghost btn-xs">
                      {bid.status}
                    </button>
                  </th>
                  <th>
                    <button
                      onClick={() => handleAccept(bid._id)}
                      disabled={!isActive(bid.status)}
                      className="btn"
                    >
                      Accept
                    </button>
                  </th>
                  <th>
                    <button
                      onClick={() => handleReject(bid._id)}
                      disabled={!isActive(bid.status)}
                      className="btn"
                    >
                      Reject
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
            {/* foot */}
          </table>
        </div>
      ) : (
        <div className="mb-6 md:mb-12">
          <h3 className="font-bold text-center text-2xl md:text-5xl mb-3">
            No Bid Request Yet!
          </h3>
          <p className="px-2 md:px-64 lg:px-72 text-gray-700 text-center text-sm md:text-lg">
            Your job postings haven't received any bids yet. Once someone places
            a bid on one of your job opportunities, it will be displayed here
            for you to review and manage.
          </p>
        </div>
      )}
    </div>
  );
};

export default BidRequest;
