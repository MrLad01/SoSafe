import image from '../assets/image.jpg';
import image3 from '../assets/image3.jpg';
import image2 from '../assets/image (1).jpg';
// Note: You'll need to import additional images for the new content
// import image4 from '../assets/image4.webp';
// import image5 from '../assets/image5.webp';
// import image6 from '../assets/image6.webp';
// import image7 from '../assets/image7.webp';
// import image8 from '../assets/image8.webp';
// import image9 from '../assets/image9.webp';
// import image10 from '../assets/image10.webp';

export interface HeroContent {
    image: string;
    title: string;
    description: string;
    badge: string;
    date: string;
    content: string;
    author: string;
}

export const heroContent: HeroContent[] = [
    {
        image: image,
        title: "Protecting Our Community",
        description: "Dedicated to ensuring the safety and security of Ogun State residents",
        badge: "Commander's Office",
        date: "2024-02-15",
        content: "Our mission extends far beyond traditional security measures. At the heart of our mandate is a comprehensive approach to community protection that integrates advanced technological solutions with human-centered strategies. We recognize that true security is not just about preventing crime, but about creating an environment where citizens feel safe, respected, and empowered. Our team of dedicated professionals works tirelessly to develop innovative security protocols that address the unique challenges faced by Ogun State residents. Through extensive training, community engagement, and strategic planning, we aim to stay ahead of emerging security threats. Our approach combines sophisticated surveillance technologies, predictive analytics, and on-ground intelligence gathering to create a multi-layered security framework. We continuously invest in our personnel's skills, ensuring they are not just law enforcement officers, but guardians of community well-being. Our commitment goes beyond immediate threat response – we focus on long-term strategies that address the root causes of insecurity, working closely with local government, community leaders, and social institutions to create lasting positive change.",
        author: "Adebayo Olusola, State Security Coordinator"
    },
    {
        image: image2,
        title: "Professional Security Services",
        description: "Trained personnel working 24/7 to maintain peace and order",
        badge: "Official Statement",
        date: "2024-03-22",
        content: "Professional security is an art and a science that demands unwavering commitment, exceptional skills, and continuous adaptation. Our personnel undergo rigorous training that goes beyond traditional law enforcement approaches. We recruit individuals who not only meet stringent physical and mental standards but also demonstrate exceptional interpersonal skills and ethical integrity. Our training programs are comprehensive, covering advanced tactical skills, crisis management, conflict resolution, and community interaction. Each team member is equipped with state-of-the-art technology, from advanced communication systems to sophisticated monitoring equipment, ensuring they can respond effectively to any situation. We maintain a 24/7 operational readiness, with multiple layers of response teams strategically positioned across Ogun State. Our approach to security is holistic – we don't just respond to incidents, but work proactively to prevent them. This involves constant risk assessment, community intelligence gathering, and collaborative approaches with local stakeholders. We understand that effective security is about building trust, maintaining transparency, and creating an environment where citizens feel protected and respected.",
        author: "Inspector Folake Adekoya, Head of Operations"
    },
    {
        image: image3,
        title: "Community Partnership",
        description: "Building strong relationships with local communities",
        badge: "Community Engagement",
        date: "2024-04-10",
        content: "Community partnership represents the most transformative approach to security in the modern era. We believe that true safety cannot be achieved through enforcement alone, but through genuine collaboration and mutual understanding. Our community engagement strategy is multifaceted, designed to break down barriers between security forces and local residents. We implement comprehensive programs that go beyond traditional outreach, including educational initiatives, youth mentorship, safety workshops, and transparent communication channels. Our team actively works to understand the unique challenges faced by different communities within Ogun State, tailoring our approach to address specific local needs. We organize regular community forums, create neighborhood watch programs, and provide platforms for citizens to share their concerns and suggestions. Technology plays a crucial role in our community partnership model, with digital platforms that allow real-time communication and feedback. We invest heavily in training our personnel in community relations, ensuring they approach their role not as external enforcers, but as trusted partners committed to collective well-being. By fostering an environment of trust, mutual respect, and shared responsibility, we aim to create a security ecosystem where every citizen feels valued, heard, and actively involved in maintaining community safety.",
        author: "Dr. Chidi Nwosu, Community Relations Director"
    },
    {
        image: image,
        title: "Technology Innovation in Security",
        description: "Leveraging cutting-edge technology for enhanced protection",
        badge: "Tech Initiative",
        date: "2024-04-15",
        content: "In today's rapidly evolving security landscape, technology plays a pivotal role in protecting our communities. Our department has embraced innovative solutions that enhance our capability to prevent, detect, and respond to security challenges. We've implemented an integrated security management system that combines artificial intelligence, machine learning, and real-time data analytics to provide predictive insights and early warning capabilities. Our state-of-the-art command center operates 24/7, monitoring a network of smart cameras and sensors strategically placed throughout Ogun State. We've also developed mobile applications that enable citizens to report incidents instantly and receive real-time security updates. Our cyber security team works tirelessly to protect critical infrastructure and personal data, ensuring that both physical and digital assets are secured. Through continuous technological advancement and adaptation, we're building a more resilient and responsive security framework that serves as a model for other regions.",
        author: "Eng. Taiwo Johnson, Chief Technology Officer"
    },
    {
        image: image2,
        title: "Youth Engagement Programs",
        description: "Investing in the next generation of community leaders",
        badge: "Youth Initiative",
        date: "2024-04-18",
        content: "Our youth engagement programs represent a crucial investment in the future security and stability of Ogun State. We believe that engaging young people in positive activities and providing them with mentorship opportunities is essential for long-term community safety. Our initiatives include after-school programs, sports leagues, educational workshops, and career guidance sessions. We've partnered with local schools and youth organizations to create pathways for young people to learn about civic responsibility, leadership, and community service. Our youth cadets program provides hands-on experience in security awareness and community protection, while our scholarship program supports promising students pursuing careers in law enforcement and public safety. Through these programs, we're not just preventing youth involvement in crime – we're nurturing the next generation of community leaders and security professionals.",
        author: "Mrs. Bukola Adeniran, Youth Programs Coordinator"
    },
    {
        image: image3,
        title: "Emergency Response Excellence",
        description: "Rapid and effective crisis management protocols",
        badge: "Emergency Services",
        date: "2024-04-22",
        content: "Our emergency response capabilities represent the pinnacle of crisis management excellence. We've developed comprehensive protocols that ensure swift, coordinated responses to any emergency situation. Our teams are equipped with advanced communication systems and specialized equipment, enabling them to handle everything from natural disasters to security threats. Regular drills and simulations keep our personnel sharp and ready to act at a moment's notice. We've established strategic partnerships with medical services, fire departments, and other emergency responders to ensure seamless coordination during critical situations. Our emergency command center utilizes advanced dispatch systems and real-time tracking to optimize response times and resource allocation. We've also implemented community emergency preparedness programs, ensuring that citizens know how to respond during crises and can effectively collaborate with emergency services.",
        author: "Captain Yusuf Ibrahim, Emergency Response Commander"
    },
    {
        image: image,
        title: "Business Security Partnership",
        description: "Supporting economic growth through enhanced security measures",
        badge: "Business Security",
        date: "2024-04-25",
        content: "The security of our business community is crucial for the economic prosperity of Ogun State. We've developed specialized security protocols and services tailored to the unique needs of businesses, from small enterprises to large corporations. Our business security unit provides risk assessments, security planning, and rapid response services to ensure a safe environment for commerce. We organize regular security workshops for business owners and employees, covering topics such as fraud prevention, physical security, and emergency procedures. Our team works closely with industry associations to understand sector-specific security challenges and develop targeted solutions. We've also implemented a business security network that enables real-time communication and collaboration between businesses and security services, creating a unified front against security threats to our economic infrastructure.",
        author: "Mr. Samuel Okafor, Business Security Liaison"
    },
    {
        image: image2,
        title: "Women's Safety Initiative",
        description: "Dedicated programs ensuring safety and empowerment of women",
        badge: "Women's Safety",
        date: "2024-04-28",
        content: "Our Women's Safety Initiative represents a comprehensive approach to addressing the unique security challenges faced by women in our community. We've implemented specialized programs including self-defense training, safety awareness workshops, and dedicated response teams for gender-based security issues. Our female officers lead community outreach programs that create safe spaces for women to discuss security concerns and seek assistance. We've established a 24/7 women's helpline and developed a mobile app specifically designed for women's safety. Through partnerships with women's organizations and advocacy groups, we're working to create an environment where women feel confident and secure in their daily lives. Our initiative also focuses on preventive measures, including education programs for men and boys about respect and gender equality, and community awareness campaigns about women's rights and safety.",
        author: "DSP Sarah Adeleke, Women's Safety Coordinator"
    },
    {
        image: image3,
        title: "Rural Security Enhancement",
        description: "Extending comprehensive security coverage to rural areas",
        badge: "Rural Security",
        date: "2024-05-01",
        content: "Our rural security enhancement program addresses the unique challenges faced by communities outside urban centers. We've developed specialized strategies that take into account the geographical spread, infrastructure limitations, and specific security needs of rural areas. Our mobile security units provide regular patrols and rapid response capabilities to remote locations. We've established community security committees in rural areas, empowering local leaders to participate in security planning and implementation. Our rural communication network ensures that even the most remote communities have access to emergency services and security support. We've also implemented agricultural security measures to protect farmers and their assets, recognizing the crucial role of agriculture in our state's economy. Through technology and community engagement, we're working to ensure that rural residents receive the same level of security services as their urban counterparts.",
        author: "ACP Mohammed Bello, Rural Security Commander"
    },
    {
        image: image,
        title: "Security Education and Training",
        description: "Building a knowledgeable and prepared community",
        badge: "Education",
        date: "2024-05-05",
        content: "Education and training form the foundation of our comprehensive security strategy. We believe that an informed and prepared community is crucial for maintaining safety and security. Our education department offers a wide range of programs designed for different segments of society, from school children to senior citizens. We conduct regular workshops on personal safety, cybersecurity, emergency preparedness, and crime prevention. Our training programs utilize modern teaching methodologies, including simulation exercises, interactive workshops, and online learning platforms. We've developed specialized curricula for different professional sectors, helping businesses and organizations build their internal security capabilities. Our community education initiatives include regular security awareness campaigns, public safety demonstrations, and information sessions on emerging security threats and prevention strategies. Through continuous education and training, we're building a community that's not only protected by security services but actively participates in maintaining its own safety.",
        author: "Professor Oluwaseun Ajayi, Director of Security Education"
    }
];