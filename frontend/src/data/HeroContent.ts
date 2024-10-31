import image from '../assets/image.webp';
import image3 from '../assets/image3.webp';
import image2 from '../assets/image (1).webp';

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
    }
];