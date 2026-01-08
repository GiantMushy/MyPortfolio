using Microsoft.AspNetCore.Mvc;
using MyPortfolio.Models;
using MyPortfolio.Repositories;

namespace MyPortfolio.Controllers
{
    [Route("Education")]
    public class EducationController : Controller
    {
        private readonly EducationRepository _repository;

        public EducationController()
        {
            _repository = new EducationRepository();
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            var educationList = _repository.GetAllEducation();
            return View(educationList);
        }
    }
}