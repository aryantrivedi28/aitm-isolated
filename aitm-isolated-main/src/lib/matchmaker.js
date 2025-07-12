export async function matchFreelancerToClient(clientRequest, freelancers) {
    const normalize = (arr) => {
      if (typeof arr === 'string') {
        try {
          arr = JSON.parse(arr);
        } catch {
          arr = [];
        }
      }
      return arr?.map((s) => s.toLowerCase().trim()) || [];
    };
  
    const clientNeeds = normalize(clientRequest.services);
  
    const matchedFreelancers = freelancers.filter((freelancer) => {
      const freelancerSkills = normalize(freelancer.domains);
      return clientNeeds.some(service => freelancerSkills.includes(service));
    });
  
    return matchedFreelancers[0] || null;
  }
  