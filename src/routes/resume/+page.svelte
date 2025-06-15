<script lang="ts">
  import { onMount } from "svelte";
  import { resumeData } from "$lib/data/resume.data";
  import { Button } from "$lib/components/ui/button";
  import { Download } from "@lucide/svelte";
  import { gsap } from "gsap";
  import { ScrollTrigger, ScrollSmoother } from "gsap/all";

  let mounted = $state(false);
  let activeSection = $state("contact");

  const sections = [
    { id: "contact", title: "Contact", icon: "👤" },
    { id: "education", title: "Education", icon: "🎓" },
    { id: "experience", title: "Experience", icon: "💼" },
    { id: "projects", title: "Projects", icon: "🚀" },
    { id: "skills", title: "Skills", icon: "⚡" },
    { id: "languages", title: "Languages", icon: "🌍" },
    { id: "volunteer", title: "Volunteer", icon: "❤️" },
  ];

  function scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function updateActiveSection() {
    if (!mounted) return;

    const sectionElements = sections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);
    const scrollPosition = window.scrollY + 200;

    for (let i = sectionElements.length - 1; i >= 0; i--) {
      const element = sectionElements[i];
      if (element && element.offsetTop <= scrollPosition) {
        activeSection = sections[i].id;
        break;
      }
    }
  }

  onMount(() => {
    mounted = true;
    window.addEventListener("scroll", updateActiveSection);
    updateActiveSection();

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    // ScrollSmoother.create({
    //   smooth: 2,
    //   effects: true,
    //   // normalizeScroll: true,
    // });

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
    };
  });
</script>

<svelte:head>
  <title>Resume - {resumeData.contact.name}</title>
  <meta
    name="description"
    content="Professional resume of {resumeData.contact
      .name} - {resumeData.summary}"
  />
  <meta
    name="keywords"
    content="resume, software developer, computer science, full-stack, web development"
  />
</svelte:head>

