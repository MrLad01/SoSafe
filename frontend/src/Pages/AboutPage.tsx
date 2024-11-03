// import React from 'react';
import { Shield, Users, Target, Award, Clock, ChevronRight, Phone, Mail, Building, Star, Landmark } from 'lucide-react';
import { NavBar } from '../components/NavBar';
import Footer from '../components/Footer';

const AgencyPage = () => {
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
    <div>
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16 bg-green-50 p-12 rounded-lg">
            <h1 className="text-5xl font-bold text-green-800 mb-6">About Ogun So-Safe Corps</h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            As the premier state security organization in Ogun State, we are dedicated to fostering 
            safe communities through professional security services, community partnerships, and 
            innovative law enforcement strategies.
            </p>
        </div>

        {/* Mission, Vision, Values Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Mission Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col items-start">
                <Target className="w-10 h-10 text-green-700 mb-3" />
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                To provide comprehensive security services and maintain peace through community-oriented 
                approaches, ensuring the safety and well-being of all residents in Ogun State.
                </p>
                <ul className="space-y-2">
                <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-green-600" />
                    <span>Proactive crime prevention</span>
                </li>
                <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-green-600" />
                    <span>Community engagement</span>
                </li>
                <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-green-600" />
                    <span>Professional development</span>
                </li>
                </ul>
            </div>
            </div>

            {/* Vision Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col items-start">
                <Award className="w-10 h-10 text-green-700 mb-3" />
                <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                To be the leading state security organization in Nigeria, recognized for excellence, 
                integrity, and innovative community security solutions.
                </p>
                <ul className="space-y-2">
                <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-green-600" />
                    <span>Set industry standards</span>
                </li>
                <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-green-600" />
                    <span>Foster community trust</span>
                </li>
                <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-green-600" />
                    <span>Lead in innovation</span>
                </li>
                </ul>
            </div>
            </div>

            {/* Values Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col items-start">
                <Shield className="w-10 h-10 text-green-700 mb-3" />
                <h2 className="text-2xl font-bold mb-4">Core Values</h2>
                <ul className="space-y-4">
                <li>
                    <h3 className="font-semibold text-lg mb-1 text-green-800">Integrity</h3>
                    <p className="text-gray-600">Upholding the highest ethical standards</p>
                </li>
                <li>
                    <h3 className="font-semibold text-lg mb-1 text-green-800">Professionalism</h3>
                    <p className="text-gray-600">Delivering expert services with discipline</p>
                </li>
                <li>
                    <h3 className="font-semibold text-lg mb-1 text-green-800">Community First</h3>
                    <p className="text-gray-600">Prioritizing community needs and partnerships</p>
                </li>
                </ul>
            </div>
            </div>
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

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
            <Phone className="w-10 h-10 text-green-700" />
            <div>
                <h2 className="text-2xl font-bold">Contact Us</h2>
                <p className="text-gray-600">Get in touch with our team</p>
            </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
                <Building className="w-5 h-5 text-green-700 mt-1" />
                <div>
                <h3 className="font-semibold mb-1">Headquarters</h3>
                <p className="text-gray-600">123 Security Avenue, Abeokuta, Ogun State</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-green-700 mt-1" />
                <div>
                <h3 className="font-semibold mb-1">Emergency Hotline</h3>
                <p className="text-gray-600">0800-SOSAFE-247</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-green-700 mt-1" />
                <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-gray-600">contact@ogunsosafe.gov.ng</p>
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
  const executiveTeam = [
    {
      name: "Commander Johnson Abidemi",
      position: "State Commander",
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
    },
    // Add more team members as needed
  ];

  return (
    <div>
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16 bg-green-50 p-12 rounded-lg">
            <h1 className="text-5xl font-bold text-green-800 mb-6">Our Management Team</h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Meet the dedicated leaders who guide our organization in serving and protecting Ogun State.
            </p>
        </div>

        {/* Executive Team Section */}
        <div className="mb-16">
            <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">Executive Leadership</h2>
            <div className="grid md:grid-cols-2 gap-6">
            {executiveTeam.map((member, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start gap-4">
                    <Users className="w-10 h-10 text-green-700" />
                    <div>
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-lg text-green-600 font-semibold mb-3">{member.position}</p>
                    <p className="text-gray-600 mb-4">{member.description}</p>
                    <h4 className="font-semibold mb-2">Key Responsibilities:</h4>
                    <ul className="space-y-1">
                        {member.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                            <ChevronRight className="w-4 h-4 text-green-600" />
                            <span className="text-gray-600">{resp}</span>
                        </li>
                        ))}
                    </ul>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* Organizational Structure */}
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
            <Landmark className="w-10 h-10 text-green-700" />
            <div>
                <h2 className="text-2xl font-bold">Organizational Structure</h2>
                <p className="text-gray-600">Our departmental framework</p>
            </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
            <div>
                <h3 className="text-xl font-bold mb-4">Operations Department</h3>
                <ul className="space-y-2">
                <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-green-600" />
                    <span>Tactical Response Unit</span>
                </li>
                <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-green-600" />
                    <span>Emergency Response Team</span>
                </li>
                <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-green-600" />
                    <span>Intelligence Unit</span>
                </li>
                </ul>
            </div>
            <div>
                <h3 className="text-xl font-bold mb-4">Administration Department</h3>
                <ul className="space-y-2">
                <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-green-600" />
                    <span>Human Resources</span>
                </li>
                <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-green-600" />
                    <span>Finance & Logistics</span>
                </li>
                <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-green-600" />
                    <span>Training & Development</span>
                </li>
                </ul>
            </div>
            </div>
        </div>
        </div>
        <Footer />
    </div>
  );
};

export { AgencyPage, ManagementTeamPage };