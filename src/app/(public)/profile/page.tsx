import ProfileForm from "@/features/students/components/public/profileform";


export const dynamic = "force-dynamic";
export const revalidate = 0;

const page = async () => {
  return <ProfileForm />;
};

export default page;
