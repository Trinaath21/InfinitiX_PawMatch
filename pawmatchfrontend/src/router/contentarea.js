import { createBrowserRouter, Navigate } from "react-router-dom";
//Main module
import Main from "../Pages/main";
//Home module
import Home from "../Pages/Home";
import Landing from "../Pages/LandingPage";
//Login module
import Login from "../Pages/Login";
//Register module
import Register from "../Pages/Register";
//Profile module
import MemberProfile from "../Pages/Profiles/MemberProfile";
import ShelterProfile from "../Pages/Profiles/ShelterProfile";
import EditMemberProfile from "../Pages/Profiles/EditMemberProfile";
import EditShelterProfile from "../Pages/Profiles/EditShelterProfile";
//Adoption module
import AddAdoption from "../Pages/Adoption/AddAdoption";
import ApplyAdoption from "../Pages/Adoption/ApplyAdoption";
import EditAdoption from "../Pages/Adoption/EditAdoption";
import ViewMoreAdoption from "../Pages/Adoption/ViewMoreAdoption";
import ViewPersonalListing from "../Pages/Adoption/ViewPersonalListing";
import ViewPublicListing from "../Pages/Adoption/ViewPublicListing";
//Donation module
import AddDonation from "../Pages/Donation/AddDonation";
import EditDonation from "../Pages/Donation/EditDonation";
import ViewAllDonation from "../Pages/Donation/ViewAllDonation";
import ViewMyDonation from "../Pages/Donation/ViewMyDonation";
//LostFound module
import AddNewReport from "../Pages/LostFound/AddNewReport";
import AddReplyReport from "../Pages/LostFound/AddReplyReport";
import EditReport from "../Pages/LostFound/EditReport";
import PersonalLostPetListing from "../Pages/LostFound/PersonalLostPetListing";
import PublicLostPetListing from "../Pages/LostFound/PublicLostPetListing";
import ViewMoreDetails from "../Pages/LostFound/ViewMoreDetails";
import ViewReplyReport from "../Pages/LostFound/ViewReplyReport";
//Stray module
import AddStrayReport from "../Pages/Stray/AddStrayReport";
import EditStrayReport from "../Pages/Stray/EditStrayReport";
import PersonalStrayListings from "../Pages/Stray/PersonalStrayListings";
import ViewMoreStrayDetails from "../Pages/Stray/ViewMoreStrayDetails";
import PublicStrayListings from "../Pages/Stray/PublicStrayListings";
//Forum module
import CreateForumPost from "../Pages/Forum/CreateForumPost";
import ForumPostComponent from "../Pages/Forum/ForumPostComponent";
import EditForumPost from "../Pages/Forum/EditForumPost";
import PostDetails from "../Pages/Forum/PostDetails";

//Password module
import ForgotPassword from "../Pages/Password/forgetpassword";
import ResetPassword from "../Pages/Password/resetpassword";

const routes = [
  {
    path: "/",
    element: <Navigate to="/landing" replace />,
  },
  {
    path: "/landing",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forget-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  /*   {
    path: "/home",
    element: <Home />,
  }, */
  {
    path: "/main",
    element: <Main />,
    children: [
      /*  {
        path: "profiles",
        element: <Navigate to="/main/profiles/member" />,
      }, */
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "profiles/member",
        element: <MemberProfile />,
      },
      {
        path: "profiles/member/edit",
        element: <EditMemberProfile />,
      },
      {
        path: "profiles/shelter",
        element: <ShelterProfile />,
      },
      {
        path: "profiles/shelter/edit",
        element: <EditShelterProfile />,
      },
      // Adoption routes

      {
        path: "adoption/add",
        element: <AddAdoption />,
      },
      {
        path: "adoption/apply",
        element: <ApplyAdoption />,
      },
      {
        path: "adoption/edit",
        element: <EditAdoption />,
      },
      {
        path: "adoption/view-public",
        element: <ViewPublicListing />,
      },
      {
        path: "adoption/view-personal",
        element: <ViewPersonalListing />,
      },
      {
        path: "adoption/view-more",
        element: <ViewMoreAdoption />,
      },
      //donation routes
      {
        path: "donation/view-all",
        element: <ViewAllDonation />,
      },
      {
        path: "donation/add",
        element: <AddDonation />,
      },
      {
        path: "donation/edit/:id",
        element: <EditDonation />,
      },

      {
        path: "donation/view-my",
        element: <ViewMyDonation />,
      },
      //stray routes
      {
        path: "stray/add",
        element: <AddStrayReport />,
      },
      {
        path: "stray/edit",
        element: <EditStrayReport />,
      },
      {
        path: "stray/view-more",
        element: <ViewMoreStrayDetails />,
      },
      {
        path: "stray/view-public",
        element: <PublicStrayListings />,
      },
      {
        path: "stray/view-personal",
        element: <PersonalStrayListings />,
      },
      //forum routes
      /*    {
        path: "forum/create",
        element: <CreateForumPost />,
      },
      {
        path: "forum/edit",
        element: <EditForumPost />,
      },
      {
        path: "forum/post-details",
        element: <PostDetails />,
      }, */
      {
        path: "forum/post-component",
        element: <ForumPostComponent />,
      },
      //LostFound routes
      {
        path: "lostfound/add",
        element: <AddNewReport />,
      },
      {
        path: "lostfound/add-reply",
        element: <AddReplyReport />,
      },
      {
        path: "lostfound/edit",
        element: <EditReport />,
      },
      {
        path: "lostfound/view-public",
        element: <PublicLostPetListing />,
      },
      {
        path: "lostfound/view-personal",
        element: <PersonalLostPetListing />,
      },
      {
        path: "lostfound/view-details",
        element: <ViewMoreDetails />,
      },
      {
        path: "lostfound/view-reply",
        element: <ViewReplyReport />,
      },
    ],
  },
];

export default createBrowserRouter(routes);
