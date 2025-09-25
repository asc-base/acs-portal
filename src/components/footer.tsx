import Image from "next/image";
import Link from "next/link";
import LOGOACS from "../../public/logoacs.png";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import YouTubeIcon from "@mui/icons-material/YouTube";

export const Footer = () => {
  const linkIcons = [
    {
      icon: <FacebookRoundedIcon />,
      href: "https://www.facebook.com/profile.php?id=100086247692906",
    },
    {
      icon: <Image src="/instagram.png" alt="instagrams" width={24} height={24} />,
      href: "https://www.instagram.com/dek_warmkid/",
    },
    {
      icon: <YouTubeIcon />,
      href: "https://www.youtube.com/@ACSOfficial_KMUTT",
    },

  ];

  return (
    <div className="bg-primary01 px-6 py-8 text-white md:px-12">
      <div className="flex flex-col flex-wrap gap-4 lg:flex-row">
        <div className="flex w-full flex-col items-start md:flex-row lg:flex-1">
          <div className="flex min-w-[120px] flex-col gap-4 pb-5">
            <Image src={LOGOACS} alt="ACS Logo" width={107} height={96.12} />
            <div className="flex items-center gap-x-4">
              {linkIcons.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>

          <div className="w-full md:flex-1 md:ml-10">
            <h4 className="text-secondary01 font-bold mb-2">ติดต่อเรา</h4>
            <h5 className="text-neutral01 leading-relaxed whitespace-nowrap">
              ภาควิชาคณิตศาสตร์ คณะวิทยาศาสตร์ <br />
              มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี
              <br />
              126 ถนนประชาอุทิศ แขวงบางมด เขตทุ่งครุ กรุงเทพฯ 10140
              <br />
              โทรศัพท์ 02 470 8822, 02 470 9585
              <br />
              โทรสาร 02 428 4025
            </h5>
          </div>
        </div>

        <div className="flex w-full flex-wrap gap-4 overflow-hidden break-words lg:flex-[2]">
          <div className="flex min-w-[100px] flex-1 flex-col gap-2">
            <Link href="/home">
              <h4 className="text-secondary01 font-bold">สมัครเรียน</h4>
            </Link>
            <Link href="/curriculum">
              <h4 className="text-secondary01 font-bold">หลักสูตร</h4>
            </Link>
            {/*           <Link href="#">*/}
            <h5 className="text-neutral01">หลักสูตรใหม่ พ.ศ2565</h5>
            {/*</Link> */}
            {/* <Link href="#"> */}
            <h5 className="text-neutral01">หลักสูตร พ.ศ.2560</h5>
            {/* </Link> */}
          </div>

          <div className="flex min-w-[150px] flex-1 flex-col gap-2">
            <h4 className="text-secondary01 font-bold whitespace-nowrap">
              ข่าวสารและกิจกรรม
            </h4>
            <Link href="/news?category=ข่าวสารและกิจกรรม&page=1&pageSize=12">
              <h5 className="text-neutral01">ประชาสัมพันธ์</h5>
            </Link>
                      <Link href="/news?category=ความสำเร็จสาขาวิชา&page=1&pageSize=12">
            <h5 className="text-neutral01">ความสำเร็จสาขาวิชา</h5>
             </Link>
                       <Link href="/news?category=งานกิจกรรมนักศึกษา&page=1&pageSize=12">
            <h5 className="text-neutral01">งานกิจกรรมนักศึกษา</h5>
          </Link>
          </div>

          <div className="flex min-w-[120px] flex-1 flex-col gap-2">
            {/*
                         <Link
                            href="#"*/}
            <h4 className="text-secondary01 font-bold whitespace-nowrap">
              ผลงานนักศึกษา
            </h4>
            {/* </Link>
                         <Link
                            href="#" */}
            <h4 className="text-secondary01 font-bold">ทำเนียบรุ่น</h4>
            {/* </Link>
                         <Link
                            href="#" */}
            <h4 className="text-secondary01 font-bold">เกี่ยวกับเรา</h4>
            {/* </Link>
                         <Link
                            href="#" */}
            <h5 className="text-neutral01">คณาจารย์</h5>
            {/* </Link>
                         <Link
                            href="#" */}
            <h5 className="text-neutral01">ประวัติสาขา</h5>
            {/* </Link>
                         <Link
                            href="#" */}
            <h5 className="text-neutral01">บรรยากาศในสาขา</h5>
            {/* </Link> */}
          </div>

          <div className="flex min-w-[220px] flex-1 flex-col gap-2">
            <h4 className="text-secondary01 font-bold whitespace-nowrap">
              เว็บไซต์หลักของมหาวิทยาลัย
            </h4>
            <Link
              href="https://www.leb2.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h5 className="text-neutral01">LEB2</h5>
            </Link>
            <Link
              href="https://sinfo.kmutt.ac.th/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h5 className="text-neutral01">New Acis</h5>
            </Link>
            <Link
              href="https://www.kmutt.ac.th/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h5 className="text-neutral01">มหาวิทยาลัย</h5>
            </Link>
            <Link
              href="https://sola.pr.kmutt.ac.th/homesola/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h5 className="text-neutral01">Sola.Kmutt</h5>
            </Link>
            <Link
              href="https://science.kmutt.ac.th/สำนักงานคณะบดีฯ/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h5 className="text-neutral01">สำนักงานคณบดี</h5>
            </Link>
            <Link
              href="https://math.kmutt.ac.th/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h5 className="text-neutral01">ภาควิชาคณิตศาสตร์</h5>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
