// import React from 'react';
import {  Award,  Phone, Mail, MapPin, Globe, BookOpen, Scale, Clock, Star, User, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import logo from '../assets/logo.webp'
import commander from '../assets/state-commander.jpg'
import { NavBar } from '../components/NavBar';
import Footer from '../components/Footer';
import { useState } from 'react';

// Background Watermark Component
const Watermark = () => (
  <div className="fixed inset-0 pointer-events-none opacity-5 scale-125 flex items-center justify-center">
    <img src={logo} alt="watermark" className="w-96 h-96" />
  </div>
);

const AgencyPage = () => {
  const legalFramework = [
    {
      title: "Establishment Act",
      content: "The Ogun State Community Social Orientation and Safety Corps Law 2017"
    },
    {
      title: "Constitutional Backing",
      content: "Operating under Section 14(2)(b) of the 1999 Constitution"
    }
  ];

  const governmentSupport = [
    {
      title: "Financial Support",
      content: "Annual budgetary allocation for operations and equipment"
    },
    {
      title: "Training Support",
      content: "Collaboration with federal security agencies for personnel training"
    }
  ];

  const formationText = `
        Ogun State Community Social Orientation and Safety Corps, or So-Safe Corps, is a security branch of the State Government that was legally created to carry out its constitutional duties of combating crime and criminality. 
        
        A Bill for a law to establish the Ogun State Community Social Orientation and Safety Corps (So-Safe Corps) Agency for the Regulation and Control of Community Social Orientation and Safety Corps Activities and Connected Purposes commenced 27th December 2017.

        The role of So-Safe Corps as established with the law includes assisting the Police and other security Agencies within the State to maintain law and order by gathering information about crime, crime in progress, suspicious activities and crime suspects among other things which also includes putting structure in place to ensure that hoodlums and cult groups do not have opportunity to operate in communities or anywhere within the state by undertaking routine motorized patrol day and night, as well as reducing the crime rate and ensuring that offenders are identified and made to account for their misdeed and following up on arrest of offenders to the Court and ensuring justice.

        The law in same vein provides timely reporting of suspicious activities and crimes in progress to the police or other security agencies, improving relationship between the police and the community as it concerns law enforcement. The law equally stipulates providing the police with relevant information that will enhance their understanding of how to effectively Police the communities, as well as to support the cause of community development especially on issues relating to security.

        Without prejudice to the provision of Section 2 of this Law, the agency engages the service of volunteers (eg-ex-serving men, retirees, baales, chiefs and CDA officials) as Special Marshals in mass orientation of their communities in security consciousness and campaign against social vices. It also serves as the coordinating body for the uniformed and non-uniformed community corps established and operating within all the local government and local council development
  
    `

  const historicalMilestones = [
    { year: 2017, event: "Establishment of Ogun So-Safe Corps" },
    { year: 2018, event: "First major recruitment and training exercise" },
    { year: 2019, event: "Expansion to all Local Government Areas" },
    { year: 2020, event: "Implementation of community policing framework" },
    { year: 2021, event: "Launch of rural security initiative" },
    { year: 2022, event: "Digital transformation and modernization program" },
    { year: 2023, event: "Achievement of state-wide coverage milestone" }
  ];

  const achievements = [
    { title: "Crime Rate Reduction", stat: "40%", description: "Decrease in reported incidents since establishment" },
    { title: "Community Outreach", stat: "500+", description: "Programs conducted across the state" },
    { title: "Response Time", stat: "15 min", description: "Average emergency response time" },
    { title: "Training Hours", stat: "10,000+", description: "Annual personnel development" }
  ];

  return (
    <div className="relative min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        {/* <Watermark /> */}
        {/* Hero Section */}
        <div className="text-center mb-16 bg-green-50 p-12 rounded-lg shadow-lg">
          <h1 className="text-5xl font-bold text-green-800 mb-6">About Ogun So-Safe Corps</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            A premier state security organization committed to fostering safe communities through 
            professional security services and innovative law enforcement strategies.
          </p>
        </div>

        {/* Formation History */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <BookOpen className="w-8 h-8 text-green-700 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-green-800 mb-3">Our Formation</h2>
              <p className="text-gray-600 leading-relaxed">
                {formationText}
              </p>
            </div>
          </div>
        </div>

        {/* Legal Framework */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {legalFramework.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <Scale className="w-8 h-8 text-green-700 mb-4" />
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.content}</p>
            </div>
          ))}
        </div>

        {/* Timeline Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-16">
            <div className="flex items-center gap-3 mb-6">
            <Clock className="w-10 h-10 text-green-700" />
            <div>
                <h2 className="text-2xl font-bold">Historical Timeline</h2>
                <p className="text-gray-600">Key milestones in our journey</p>
            </div>
            </div>
            <div className="space-y-6">
            {historicalMilestones.map((milestone, index) => (
                <div key={index} className="flex items-start gap-4">
                <div className="min-w-[100px] font-bold text-green-700">{milestone.year}</div>
                <div className="flex-1 pb-4 border-b border-gray-200">
                    <p className="text-gray-600">{milestone.event}</p>
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* Achievements Section */}
        <div className="mb-16">
            <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">Our Impact</h2>
            <div className="grid md:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <Star className="w-8 h-8 text-green-700 mb-3" />
                <h3 className="text-4xl font-bold text-green-800 mb-2">{achievement.stat}</h3>
                <p className="text-lg font-semibold mb-2">{achievement.title}</p>
                <p className="text-gray-600">{achievement.description}</p>
                </div>
            ))}
            </div>
        </div>

        {/* Government Partnership */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            {/* <Government className="w-8 h-8 text-green-700 flex-shrink-0" /> */}
            <div>
              <h2 className="text-2xl font-bold text-green-800 mb-3">Government Partnership</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {governmentSupport.map((item, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const ManagementTeamPage = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const executiveTeam = [
      {
        name: "Deputy Commander Johnson Abidemi",
        position: "Deputy State Commander",
        description: "Over 20 years of security and law enforcement experience.",
        responsibilities: [
          "Strategic planning and direction",
          "Policy formulation and implementation",
          "Stakeholder management",
          "Inter-agency coordination"
        ]
      },
      {
        name: "Deputy Commander Sarah Ogunleye",
        position: "Deputy State Commander",
        description: "Specialized in community relations and personnel development.",
        responsibilities: [
          "Operations oversight",
          "Personnel management",
          "Training coordination",
          "Community engagement"
        ]
      }
    ];
  
    const fullBio = `
        Soji Ganzallo, the State Commander of Ogun State Community, Social Orientation and Safety Corps ( So-Safe Corps) was born on 7th February, 1962. This great indigene of Egba, from the Ligegere’s Family, Ake Land, Abeokuta, Ogun State has strong passion for security and safety of people lives and property.


        He began his elementary education in Ibadan, Oyo State, where he proceeded to Iseyin Distinct Grammar School at Iseyin, there he successfully obtained his West African School Certificate (WASC).

        Soji Ganzallo gained admission into Ogun State Polytechnic, now Moshood Abiola Polytechnic (MAPOLY), Abeokuta for a 2 years diploma programme.

        He also proceeded into Ogun State University (OSU), now Olabisi Onabanjo University (OOU), where he studied Public Administration and bagged a Bachelor’s Degree (B.Sc) in the same field.


        He is a professional member of the Institute of Corporate Administration(ICAD)

        He is a Professional Fellow Institute of Information Management Africa (FIIM)as well as FELLOW  Institute of Security Management, United Kingdom (UK).

        He ventured into security, the terrain where his qualitative and brilliant performance has been of tremendous benefit to humanity, community and Ogun State.


        The remarkable performance of Soji Ganzallo in security matters kicked off when he was appointed in 2008 as the Executive Secretary of War Against Crime (WAC) in Ogun State,a position he held till August 2011, after which he was drafted to the Vigilante Service of Ogun State as the Outfit Public Relations Officer (PRO).


        In May 12th. 2016, Ogun State Government appointed Soji Ganzallo as the State Commander of the Vigilante Service of Ogun State. This was as a result of his passion and tremendous effort in security matters confronting the State.

        Ganzallo, a holder of Advance Diploma in Security Operations Management , Institute of Security Nigeria (ISN) UNILAG- 2018

        He is also a Professional Specialist in Criminal Investigation, Digital Forensic and Intelligence Studies ,ISN, UNILAG.

        He has Diploma in Security Operational Management, Olabisi Onabanjo University Consult in collaboration with Institute of Criminology Studies and Security Management of Nigeria- 2018.

        He is a Certified security Guru in Managing Security and Security Challenges for Grassroots’ Transformation by House of Representatives Committee on National Security and Intelligence- 2018.

        He has attended a number of courses on Firearms handling and Intelligence gathering techniques both at home and aboad ( South Africa ,Ghana etc)

        He is a holder of certificate in Security Management, London Royal College of Secutity- Jan-Nov 2006
        
        Certificate holder in Advanced Firearms Training, South Africa- 2015

        Commander Soji Ganzallo was the State Vice Chairman in charge of  Community Policing and Intelligence Gathering of Police Community Relations Committee (PCRC) Ogun State Command .And presently, he is a State Patron of PCRC in the State. 

        Commander Ganzallo is an Ambassador of War Against Drug Abuse(WADA) 

        Commander Soji Ganzallo FCAI, is a prolific writer and as at today he has over (20) twenty publications on security and contemporary issues.

        Awards and accolades received by him are in recognition and appreciation of his selfless service to Ogun State in particular and Nigeria in general.

        Commander Soji Ganzallo, is a regular producer and presenter of security tips on Ogun Radio OGBC 2 (90.5 FM) and has been doing it since 2011 till date. He has equally been involved in public enlightenment on security for decade.
        He is married and blessed with wonderful children.
    `;
  
    // Truncate text to roughly 400 words
    const truncatedBio = fullBio.split(' ').slice(0, 200).join(' ') + '...';
  
    return (
        <div className="">
            <NavBar />
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header Section */}
                <div className="text-center mb-12 bg-gradient-to-br from-green-50 to-green-100 pt-16 pb-12 rounded-2xl shadow-sm">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-green-900 bg-clip-text pb-1 text-transparent mb-2">
                    Our Management Team
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Meet the dedicated leaders who guide our organization in serving and protecting Ogun State.
                    </p>
                </div>
        
                {/* Commander's Profile */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
                    Executive Leadership
                    </h2>
                    <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="md:col-span-1">
                        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-green-600 to-green-700 p-0.5">
                            <img 
                            src={commander}
                            alt="State Commander"
                            className="w-full rounded-xl shadow-lg hover:scale-102 transition-transform duration-300"
                            />
                        </div>
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                            <Award className="w-5 h-5 text-green-600" />
                            <span className="text-green-800">20+ Years Experience</span>
                            </div>
                            <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                            <User className="w-5 h-5 text-green-600" />
                            <span className="text-green-800">Professional Fellow</span>
                            </div>
                        </div>
                        </div>
                        <div className="md:col-span-2">
                        <h2 className="text-3xl font-bold text-green-800 mb-3">
                            Commander (Dr.) Soji Ganzallo FCAI,FIIM,fisn
                        </h2>
                        <p className="text-xl text-green-600 mb-6">State Commander</p>
                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-600 leading-relaxed">
                            {isExpanded ? fullBio : truncatedBio}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="mt-6 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold transition-colors duration-200"
                        >
                            {isExpanded ? (
                            <>
                                Show Less
                                <ChevronUp className="w-5 h-5" />
                            </>
                            ) : (
                            <>
                                Read More
                                <ChevronDown className="w-5 h-5" />
                            </>
                            )}
                        </button>
                        </div>
                    </div>
                    </div>
                </div>
        
                {/* Executive Team Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {executiveTeam.map((member, index) => (
                    <div 
                        key={index} 
                        className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="flex items-start gap-6">
                        <div className="bg-green-100 p-3 rounded-full">
                            <User className="w-8 h-8 text-green-700" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-green-800 mb-2">{member.name}</h3>
                            <p className="text-lg text-green-600 font-semibold mb-4">{member.position}</p>
                            <p className="text-gray-600 mb-6">{member.description}</p>
                            <h4 className="font-semibold mb-3 text-green-800">Key Responsibilities:</h4>
                            <ul className="space-y-2">
                            {member.responsibilities.map((resp, idx) => (
                                <li key={idx} className="flex items-center gap-3">
                                <ChevronRight className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span className="text-gray-600">{resp}</span>
                                </li>
                            ))}
                            </ul>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
        
                {/* Organizational Structure */}
                <div className="bg-white rounded-2xl shadow-xl p-12">
                    <h2 className="text-3xl font-bold text-green-800 mb-12 text-center">
                    Organizational Structure
                    </h2>
                    <div className="flex flex-col items-center space-y-6">
                    <div className="w-72 bg-gradient-to-r from-green-700 to-green-800 text-white p-6 rounded-xl text-center shadow-lg">
                        State Commander
                    </div>
                    <div className="w-0.5 h-8 bg-green-700"></div>
                    <div className="w-72 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-xl text-center shadow-lg">
                        Deputy State Commander
                    </div>
                    <div className="w-0.5 h-8 bg-green-600"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {['Directors', 'Zonal Commander', 'Area Commander'].map((title, i) => (
                        <div key={i} className="w-56 bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl text-center shadow-lg">
                            {title}
                        </div>
                        ))}
                    </div>
                    <div className="w-0.5 h-8 bg-green-500"></div>
                    <div className="w-72 bg-gradient-to-r from-green-400 to-green-500 text-white p-6 rounded-xl text-center shadow-lg">
                        Divisional Commander
                    </div>
                    <div className="w-0.5 h-8 bg-green-400"></div>
                    <div className="w-72 bg-gradient-to-r from-green-300 to-green-400 text-white p-6 rounded-xl text-center shadow-lg">
                        Post Officers
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <Footer />
        </div>
    );
  };

const ContactPage = () => {
  return (
    <div className="relative min-h-screen bg-gray-50">
      <Watermark />
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-16 bg-green-50 p-12 rounded-lg shadow-lg">
          <h1 className="text-5xl font-bold text-green-800 mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600">Get in touch with our team for emergency response or inquiries</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-bold mb-1">Emergency Hotline</h3>
                  <p className="text-lg text-green-600">0800-SOSAFE-247</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-bold mb-1">Email</h3>
                  <p className="text-green-600">contact@ogunsosafe.gov.ng</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-bold mb-1">Headquarters</h3>
                  <p className="text-gray-600">123 Security Avenue, Abeokuta, Ogun State</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Globe className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-bold mb-1">Working Hours</h3>
                  <p className="text-gray-600">24/7 Emergency Response</p>
                  <p className="text-gray-600">Office: Mon-Fri, 8am-5pm</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" placeholder='Enter your full name' className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" placeholder='Enter your email address' className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea placeholder='Enter your message' rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"></textarea>
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export { AgencyPage, ManagementTeamPage, ContactPage };