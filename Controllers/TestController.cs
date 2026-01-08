using Microsoft.AspNetCore.Mvc;
using MyPortfolio.Repositories;

namespace MyPortfolio.Controllers
{
    [Route("Test")]
    public class TestController : Controller
    {
        private readonly EducationRepository _repository;

        public TestController()
        {
            _repository = new EducationRepository();
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            var educationList = _repository.GetAllEducation();
            return Json(educationList);
        }
    }
}